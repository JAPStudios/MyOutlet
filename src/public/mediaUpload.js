import { createVideoUpload, getMyVideoUploads } from 'backend/media';

/**
 * Uploads one MP4 file to the private MyOutlet Media Manager area.
 * onProgress, when supplied, receives { loaded, total, percent }.
 * The returned session becomes submit-ready after Wix finishes transcoding.
 */
export async function uploadVideoFile(file, onProgress) {
  if (!file || typeof file.name !== 'string' || typeof file.size !== 'number') {
    throw new Error('Select an MP4 video file.');
  }
  if (!/\.mp4$/i.test(file.name) || (file.type && file.type !== 'video/mp4')) {
    throw new Error('Only MP4 video files are accepted.');
  }

  const ticket = await createVideoUpload({ fileName: file.name });
  return new Promise((resolve, reject) => {
    const body = new FormData();
    body.append(ticket.multipartFieldName || 'file', file, file.name);

    const request = new XMLHttpRequest();
    request.open(ticket.method || 'POST', ticket.uploadUrl, true);

    request.upload.onprogress = event => {
      if (typeof onProgress !== 'function' || !event.lengthComputable) return;
      onProgress({
        loaded: event.loaded,
        total: event.total,
        percent: Math.round((event.loaded / event.total) * 100)
      });
    };

    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        resolve({
          uploadSessionId: ticket.uploadSessionId,
          responseText: request.responseText
        });
      } else {
        reject(new Error('MyOutlet video upload failed with HTTP status ' + request.status + '.'));
      }
    };
    request.onerror = () => reject(new Error('MyOutlet video upload failed because the network request could not complete.'));
    request.onabort = () => reject(new Error('MyOutlet video upload was cancelled.'));
    request.send(body);
  });
}

export function getMyVideoUploadHistory(options = {}) {
  return getMyVideoUploads(options);
}
