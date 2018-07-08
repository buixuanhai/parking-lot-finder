import React, { Component } from "react";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import Dropzone from "react-dropzone";
import { compose } from "redux";
import styled from "styled-components";
import Loading from "../components/Loading";
import Icon from "antd/lib/icon";
import { Button } from "antd-mobile";

const Image = styled.img`
  max-width: 200px;
  max-height: 200px;
`;
const dropzoneStyles = (downloadURL, uploading) => ({
  border: `${downloadURL || uploading ? "none" : "1px solid #ccc"}`,
  padding: 5,
  height: 200,
  width: 200,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "20px auto"
});

const ImageContainer = styled.div`
  position: relative;
  text-align: center;
  width: 200px;
`;

// Path within Database for metadata (also used for file Storage path)
const filesPath = "uploadedFiles";

class ImageUploader extends Component {
  state = { downloadURL: null, uploading: false, key: null, fullPath: null };

  onFilesDrop = ([file]) => {
    this.setState({ uploading: true });
    const { firebase, onChange } = this.props;
    return firebase
      .uploadFile(filesPath, file, filesPath)
      .then(({ key, downloadURL, File: { fullPath } }) => {
        firebase.update(`${filesPath}/${key}`, { downloadURL });
        onChange(key);
        // this.props.handleUploadedImage(key);
        this.setState({ downloadURL, uploading: false, key, fullPath });
      });
  };

  onFileDelete = () => {
    const { fullPath, key } = this.state;
    const { firebase, onChange } = this.props;
    return firebase.deleteFile(fullPath, `${filesPath}/${key}`).then(() => {
      this.setState({ downloadURL: null });
      onChange();
    });
  };

  renderContent = () => {
    const { downloadURL, uploading } = this.state;

    if (uploading) {
      return (
        <div>
          <Loading />
          <p>Uploading...</p>
        </div>
      );
    }

    if (downloadURL) {
      return (
        <ImageContainer>
          <Image src={downloadURL} />
          <Icon
            type="delete"
            style={{
              fontSize: 24,
              position: "absolute",
              bottom: 10,
              zIndex: 100,
              left: 85,
              color: "white"
            }}
            onClick={e => {
              e.stopPropagation();
              this.onFileDelete();
            }}
          />
        </ImageContainer>
      );
    }

    return (
      <Button type="primary" inline size="small" style={{ marginRight: "4px" }}>
        Upload image
      </Button>
    );
  };

  render() {
    const { downloadURL, uploading } = this.state;
    return (
      <Dropzone
        onDrop={this.onFilesDrop}
        multiple={false}
        style={dropzoneStyles(downloadURL, uploading)}
      >
        {this.renderContent()}
      </Dropzone>
    );
  }
}

export default compose(
  firebaseConnect(),
  connect(({ firebase: { data } }) => ({
    uploadedFiles: data[filesPath]
  }))
)(ImageUploader);
