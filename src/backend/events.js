import wixData from 'wix-data';

const UPLOADS = 'MediaUploadSessions';

async function updateUploadFromEvent(event, status) {
  const context = event && event.context ? event.context : {};
  if (context.origin !== 'myoutlet-creator-upload' || !context.uploadSessionId || !context.ownerMemberId) {
    return;
  }

  const session = await wixData.get(UPLOADS, context.uploadSessionId, { suppressAuth: true });
  if (!session || session.ownerMemberId !== context.ownerMemberId) return;

  const info = event.fileInfo || {};
  const update = {
    ...session,
    status,
    fileUrl: info.fileUrl || session.fileUrl || '',
    mimeType: info.mimeType || session.mimeType,
    mediaType: info.mediaType || session.mediaType,
    sizeInBytes: Number(info.sizeInBytes) || session.sizeInBytes || 0
  };

  if (status === 'uploaded') update.uploadedAt = new Date();
  if (status === 'ready') {
    if (!info.fileUrl || info.mediaType !== 'video' || info.opStatus !== 'READY') {
      update.status = 'failed';
      update.failureMessage = 'Wix did not report a ready transcoded video file.';
    } else {
      update.readyAt = new Date();
    }
  }

  await wixData.update(UPLOADS, update, { suppressAuth: true });
}

export async function wixMediaManager_onFileUploaded(event) {
  await updateUploadFromEvent(event, 'uploaded');
}

export async function wixMediaManager_onVideoTranscoded(event) {
  await updateUploadFromEvent(event, 'ready');
}
