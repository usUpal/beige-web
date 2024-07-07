/* eslint-disable import/no-anonymous-default-export */
import axiosLib from 'axios';
import config from '../../config';

const axios = axiosLib.create({
  baseURL: config.APIEndpoint,
});

const reqConfig = (obj) => ({
  headers: {
    Authorization: `Bearer ${obj.idToken}`,
  },
});

export default {
  idToken: null,
  getFiles(userId) {
    return axios.get(`/get-files/${userId}`, reqConfig(this));
  },
  async checkIsPublic(path) {
    try {
      const res = await axios.head(config.BucketUrl + path + `?bc_timestamp=${new Date().getTime()}`); // Append unused query param to ensure that browser cache is bypassed.
      if (!res.ok) {
        console.log("Bad");
      }
      return res.status === 200;
    } catch (error) {
      return false;
    }
  },
  setPublicOrPrivate(filepath, pub) {
    return axios.post(
      pub ? '/set-public' : '/set-private',
      {
        filepath,
      },
      reqConfig(this)
    );
  },

  async getSharableUrl(filepath, download) {
    try {
      const res = await axios.post(
        '/get-share-url',
        {
          filepath,
          download,
        },
        reqConfig(this)
      );
      return res.data;
    }
    catch (error) {
      console.error('Error in getSharableUrl:', error);
      throw error;
    }
  },

  addFolder(folderpath) {
    return axios.post(
      '/add-folder',
      {
        folderpath,
      },
      reqConfig(this)
    );
  },
  deleteFile(filepath) {
    return axios.post(
      '/delete-file',
      {
        filepath,
      },
      reqConfig(this)
    );
  },
  async moveFile(filepath, destination) {
    const res = await axios.post(
      '/move-file',
      {
        filepath,
        destination,
      },
      reqConfig(this)
    );
    return res.data;
  },
  async getNewUploadPolicy(filepath, fileContentType, fileSize) {
    const res = await axios.post(
      '/get-new-upload-policy',
      {
        filepath,
        fileContentType,
        fileSize,
      },
      reqConfig(this)
    );
    return res.data;
  },
  postFile(uploadPolicy, file, progressCb) {
    const data = new FormData();
    for (const [key, value] of Object.entries(uploadPolicy.fields)) {
      // Add form fields, including policy and signature, to formdata
      data.append(key, value);
    }
    data.append('file', file); // Add the file to the formdata

    const cancelTokenSource = axiosLib.CancelToken.source();

    const uploadPromise = axiosLib.post(uploadPolicy.url, data, {
      // Use the axiosLib because it's a different API baseURL
      onUploadProgress: (p) => progressCb(p.loaded / p.total),
      cancelToken: cancelTokenSource.token,
    });

    return [uploadPromise, () => cancelTokenSource.cancel()];
  },
  async getSettings() {
    const res = await axios.get('/get-settings', reqConfig(this));
    return res.data.settings;
  },
  async saveSettings(settings) {
    const res = await axios.post(
      '/save-settings',
      {
        settings,
      },
      reqConfig(this)
    );
    return res.data;
  },
  // New method to download a folder as a ZIP file
  async downloadFolder(folderpath) {
    const res = await axios.get(`/download-folder?folderpath=${encodeURIComponent(folderpath)}`, {
      ...reqConfig(this),
      responseType: 'blob', // Important for downloading files
    });

    const blob = new Blob([res.data], { type: 'application/zip' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `${folderpath.split('/').pop()}.zip`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  },
};
