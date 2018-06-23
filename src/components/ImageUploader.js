import React, { Component } from "react";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import Dropzone from "react-dropzone";
import { compose } from "redux";
import styled from "styled-components";

const Image = styled.img`
  max-width: 200px;
  max-height: 200px;
`;
// Path within Database for metadata (also used for file Storage path)
const filesPath = "uploadedFiles";

class ImageUploader extends Component {
  state = { downloadURL: null };

  onFilesDrop = ([file]) => {
    return this.props.firebase
      .uploadFile(filesPath, file, filesPath)
      .then(({ key, downloadURL }) => {
        this.props.firebase.update(`${filesPath}/${key}`, { downloadURL });
        this.props.handleUploadedImage(key);
        this.setState({ downloadURL });
      });
  };

  onFileDelete = (file, key) => {
    // deleteFile(storagePath, dbPath)
    return this.props.firebase.deleteFile(file.fullPath, `${filesPath}/${key}`);
  };

  render() {
    const { downloadURL } = this.state;
    return (
      <div>
        <Dropzone onDrop={this.onFilesDrop} multiple={false}>
          {downloadURL ? (
            <Image src={downloadURL} />
          ) : (
            <div>Drag and drop files here or click to select</div>
          )}
        </Dropzone>
      </div>
    );
  }
}

export default compose(
  firebaseConnect(),
  connect(({ firebase: { data } }) => ({
    uploadedFiles: data[filesPath]
  }))
)(ImageUploader);
