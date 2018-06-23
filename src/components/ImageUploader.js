import React from "react";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import { map } from "lodash";
import Dropzone from "react-dropzone";
import { compose } from "redux";

// Path within Database for metadata (also used for file Storage path)
const filesPath = "uploadedFiles";

// Component Enhancer that adds props.firebase and creates a listener for
// files them passes them into props.uploadedFiles
const enhance = compose(
  firebaseConnect([filesPath]),
  connect(({ firebase: { data } }) => ({
    uploadedFiles: data[filesPath]
  }))
);

const ImageUploader = ({ uploadedFiles, firebase }) => {
  // Uploads files and push's objects containing metadata to database at dbPath
  const onFilesDrop = files => {
    // uploadFiles(storagePath, files, dbPath)
    return firebase.uploadFiles(filesPath, files, filesPath);
  };

  // Deletes file and removes metadata from database
  const onFileDelete = (file, key) => {
    // deleteFile(storagePath, dbPath)
    return firebase.deleteFile(file.fullPath, `${filesPath}/${key}`);
  };
  return (
    <div>
      <Dropzone onDrop={onFilesDrop}>
        <div>Drag and drop files here or click to select</div>
      </Dropzone>
      {uploadedFiles && (
        <div>
          <h3>Uploaded file(s):</h3>
          {map(uploadedFiles, (file, key) => (
            <div key={file.name + key}>
              <span>{file.name}</span>
              <button onClick={() => onFileDelete(file, key)}>
                Delete File
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default enhance(ImageUploader);
