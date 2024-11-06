/* eslint-disable import/no-anonymous-default-export */
import axiosLib from 'axios';
import config from '../../config';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const axios = axiosLib.create({
  baseURL: config.APIEndpoint,
});
let refreshToken;
let reqConfig;

try {
  const refreshTokenCookie = Cookies.get('refreshToken');
  if (refreshTokenCookie) {
    refreshToken = JSON.parse(refreshTokenCookie);
    reqConfig = () => ({
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken.token}`,
      },
    });
  } else {
    console.warn('No refresh token found in cookies');
    refreshToken = null;
    reqConfig = () => ({
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} catch (error) {
  console.error('Error parsing refresh token:', error);
  refreshToken = null;
  reqConfig = () => ({
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

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
      // console.error(`Error in deleteFile for ${filepath}:`, error);
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
      // console.error(`Error in moveFile for ${filepath} to ${destination}:`, error);
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
      // console.error(`Error in getNewUploadPolicy for ${filepath}:`, error);
      throw error;
    }
  },
  postFile(uploadPolicy, file, progressCb) {
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
      // console.error('Error in postFile:', error);
      throw error;
    }
  },

  async getSettings() {
    try {
      const res = await axios.get('/get-settings', reqConfig(this));
      return res.data.settings;
    } catch (error) {
      // console.error('Error in getSettings:', error);
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
      // console.error('Error in saveSettings:', error);
      throw error;
    }
  },
  // New method to download a folder as a ZIP file
  // async downloadFolder(folderpath) {
  //   try {
  //     const res = await axios.get(`/download-folder?folderpath=${encodeURIComponent(folderpath)}`, {
  //       ...reqConfig(this),
  //       responseType: 'blob',
  //     });

  //     const blob = new Blob([res.data], { type: 'application/zip' });
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.style.display = 'none';
  //     a.href = url;
  //     a.download = `${folderpath.split('/').pop()}.zip`;
  //     document.body.appendChild(a);
  //     a.click();
  //     window.URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.log(`Error in downloadFolder for ${folderpath}:`, error.message);
  //     // Display user-friendly message or handle error appropriately
  //   }
  // },
  async downloadFolder(folderpath) {
    const toastId = toast.loading('Preparing download...');
    let totalSize;
    let progress;
    let isCompleted = false;

    try {
      // Step 1: Fetch the file metadata (specifically, the total size)
      const headResponse = await axios.head(`/download-folder?folderpath=${encodeURIComponent(folderpath)}`);
      totalSize = parseInt(headResponse.headers['x-total-size'], 10);
      const totalMB = (totalSize / (1024 * 1024)).toFixed(2); // Convert to MB
      toast.update(toastId, { render: `Starting download...` });

      // Step 2: Fetch the file data and track progress
      const response = await axios.get(`/download-folder?folderpath=${encodeURIComponent(folderpath)}`, {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          if (isCompleted) return; // Skip progress updates if download is already marked as complete

          const downloadedSize = progressEvent.loaded;
          const downloadedMB = (downloadedSize / (1024 * 1024)).toFixed(2); // Convert to MB
          progress = Math.min(0.99, Math.round((downloadedSize * 100) / totalSize) / 100);

          toast.update(toastId, {
            // render: `Downloading... ${downloadedMB} MB / ${totalMB} MB (${(progress * 100).toFixed(2)}%)`,
            render: `Downloading... ${downloadedMB}/${totalMB} MB `,
            type: 'info',
            progress: progress,
          });
        },
      });

      // Mark download as complete
      isCompleted = true;

      // Step 3: Create a blob URL and trigger the download
      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${folderpath.split('/').pop()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      // Update toast to 100% after download is complete
      progress = 1;
      toast.update(toastId, {
        render: `Download completed! File size:${totalMB}MB`,
        type: 'success',
        isLoading: false,
        autoClose: 3000,
        progress: progress,
      });
    } catch (error) {
      // console.error(`Error in downloadFolder for ${folderpath}:`, error);
      toast.update(toastId, {
        render: `Download failed!`,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
      throw error;
    }
  },
};
