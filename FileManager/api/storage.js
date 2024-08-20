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
    try {
      return axios.get(`/get-files/${userId}`, reqConfig(this));
    } catch (error) {
      console.error('Error in getFiles:', error);
      throw error; // Rethrow the error to propagate it to the caller
    }
  },
  async checkIsPublic(path) {
    try {
      const res = await axios.head(config.BucketUrl + path + `?bc_timestamp=${new Date().getTime()}`); // Append unused query param to ensure that browser cache is bypassed.
      if (!res.ok) {
        console.log('Bad');
      }
      return res.status === 200;
    } catch (error) {
      console.error('Error in checkIsPublic:', error);
      return false;
    }
  },
  setPublicOrPrivate(filepath, pub) {
    try {
      return axios.post(
        pub ? '/set-public' : '/set-private',
        {
          filepath,
        },
        reqConfig(this)
      );
    } catch (error) {
      console.error(`Error in setPublicOrPrivate for ${filepath}:`, error);
      throw error;
    }
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
    } catch (error) {
      console.error('Error in getSharableUrl:', error);
      throw error;
    }
  },

  addFolder(folderpath) {
    try {
      return axios.post(
        '/add-folder',
        {
          folderpath,
        },
        reqConfig(this)
      );
    } catch (error) {
      console.error(`Error in addFolder for ${folderpath}:`, error);
      throw error;
    }
  },
  deleteFile(filepath) {
    try {
      return axios.post(
        '/delete-file',
        {
          filepath,
        },
        reqConfig(this)
      );
    } catch (error) {
      console.error(`Error in deleteFile for ${filepath}:`, error);
      throw error;
    }
  },

  async moveFile(filepath, destination) {
    try {
      const res = await axios.post(
        '/move-file',
        {
          filepath,
          destination,
        },
        reqConfig(this)
      );
      return res.data;
    } catch (error) {
      console.error(`Error in moveFile for ${filepath} to ${destination}:`, error);
      throw error;
    }
  },
  async getNewUploadPolicy(filepath, fileContentType, fileSize) {
    try {
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
    } catch (error) {
      console.error(`Error in getNewUploadPolicy for ${filepath}:`, error);
      throw error;
    }
  },
  postFile(uploadPolicy, file, progressCb) {
    console.log('🚀 ~ postFile ~ file:', file);
    try {
      const data = new FormData();
      for (const [key, value] of Object.entries(uploadPolicy.fields)) {
        data.append(key, value);
      }
      data.append('file', file);

      const cancelTokenSource = axiosLib.CancelToken.source();

      const uploadPromise = axiosLib.post(uploadPolicy.url, data, {
        // Use the axiosLib because it's a different API baseURL
        onUploadProgress: (p) => progressCb(p.loaded / p.total),
        cancelToken: cancelTokenSource.token,
      });

      return [uploadPromise, () => cancelTokenSource.cancel()];
    } catch (error) {
      console.error('Error in postFile:', error);
      throw error;
    }
  },

  async getSettings() {
    try {
      const res = await axios.get('/get-settings', reqConfig(this));
      return res.data.settings;
    } catch (error) {
      console.error('Error in getSettings:', error);
      throw error;
    }
  },
  async saveSettings(settings) {
    try {
      const res = await axios.post(
        '/save-settings',
        {
          settings,
        },
        reqConfig(this)
      );
      return res.data;
    } catch (error) {
      console.error('Error in saveSettings:', error);
      throw error;
    }
  },
  // New method to download a folder as a ZIP file
  async downloadFolder(folderpath) {
    try {
      const res = await axios.get(`/download-folder?folderpath=${encodeURIComponent(folderpath)}`, {
        ...reqConfig(this),
        responseType: 'blob',
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
    } catch (error) {
      console.log(`Error in downloadFolder for ${folderpath}:`, error.message);
      // Display user-friendly message or handle error appropriately
    }
  },
};
