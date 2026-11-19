import { browseCatalog, browseCreators, getCreatorProfile } from "backend/catalog.jsw";
import { authentication } from "wix-members-frontend";
import { browseLiveStreams } from "backend/liveStreams.jsw";
import { getPublishedMediaPlayback } from "backend/media.jsw";
import { getLiveChatMessages, sendLiveChatMessage, reportLiveChatMessage, listLiveChatReports, resolveLiveChatReport } from "backend/liveChat.jsw";
import { getMediaEngagement, listComments, likeMedia, unlikeMedia, addComment, listPendingComments, listMyPendingComments, moderateComment, moderateMyChannelComment } from "backend/engagement.jsw";
import { reportContent, listContentReports, resolveContentReport } from "backend/reports.jsw";
import { getMyPlaylists, createPlaylist, getPlaylist, addMediaToPlaylist, removeMediaFromPlaylist, updatePlaylist, deletePlaylist } from "backend/playlists.jsw";
import { getMyNotifications, markNotificationRead, markAllNotificationsRead } from "backend/notifications.jsw";
import { getMyChannel, saveMyChannel, submitContent, getMySubmissions } from "backend/catalog.jsw";
import { createVideoUpload, getMyVideoUploads } from "backend/media.jsw";
import { getMyCreatorAnalytics } from "backend/viewer.jsw";
import { createLiveStream, getMyLiveStreams, endLiveStream } from "backend/liveStreams.jsw";
import { listPendingRights, reviewRightsDeclaration } from "backend/rights.jsw";
import { getSongQueue, setSongRequestStatus, listPendingContent, moderateContent } from "backend/catalog.jsw";
import { followCreator, unfollowCreator, addToWatchlist, removeFromWatchlist, getMyWatchlist, getContinueWatching, getMyFollowing, getFollowingFeed, recordPlaybackProgress, getMyViewingPreferences, setMyViewingPreferences } from "backend/viewer.jsw";

const REQUEST_EVENT = "myoutlet:request";
const RESPONSE_EVENT = "myoutlet:response";
const READY_EVENT = "myoutlet:bridge-ready";

function sendResponse(id, ok, value) {
  window.dispatchEvent(new CustomEvent(RESPONSE_EVENT, {
    detail: ok
      ? { id, ok: true, data: value }
      : { id, ok: false, error: value }
  }));
}

async function handleRequest(detail) {
  const id = detail && typeof detail.id === "string" ? detail.id : "";
  const route = detail && typeof detail.route === "string" ? detail.route : "";
  const method = detail && typeof detail.method === "string" ? detail.method.toUpperCase() : "GET";
  const query = detail && detail.query && typeof detail.query === "object" ? detail.query : {};
  const body = detail && detail.body && typeof detail.body === "object" ? detail.body : {};

  if (!id || id.length > 120) return;

  try {
    let result;
    if (method === "GET" && route === "publicCatalog") {
      const offset = Math.min(Math.max(Number(query.offset) || 0, 0), 10000);
      const page = await browseCatalog({ offset, limit: 50 });
      const nextOffset = offset + page.items.length;
      result = {
        ...page,
        nextOffset,
        hasMore: nextOffset < page.total
      };
    } else if (method === "GET" && route === "publicLiveStreams") {
      result = await browseLiveStreams({ limit: 50, offset: 0 });
    } else if (method === "GET" && route === "publicCreators") {
      result = await browseCreators({ limit: 50, offset: 0 });
    } else if (method === "GET" && route === "creatorProfile") {
      result = await getCreatorProfile(query);
    } else if (method === "POST" && route === "publicPlayback") {
      result = await getPublishedMediaPlayback(body);
    } else if (method === "GET" && route === "liveChatMessages") {
      result = await getLiveChatMessages(query);
    } else if (method === "POST" && route === "sendLiveChatMessage") {
      result = await sendLiveChatMessage(body);
    } else if (method === "POST" && route === "reportLiveChatMessage") {
      result = await reportLiveChatMessage(body);
    } else if (method === "GET" && route === "myChannel") {
      result = await getMyChannel();
    } else if (method === "POST" && route === "saveMyChannel") {
      result = await saveMyChannel(body);
    } else if (method === "POST" && route === "submitContent") {
      result = await submitContent(body);
    } else if (method === "GET" && route === "mySubmissions") {
      result = await getMySubmissions(query);
    } else if (method === "POST" && route === "createVideoUpload") {
      result = await createVideoUpload(body);
    } else if (method === "GET" && route === "myVideoUploads") {
      result = await getMyVideoUploads(query);
    } else if (method === "GET" && route === "myCreatorAnalytics") {
      result = await getMyCreatorAnalytics(query);
    } else if (method === "POST" && route === "createLiveStream") {
      result = await createLiveStream(body);
    } else if (method === "GET" && route === "myLiveStreams") {
      result = await getMyLiveStreams(query);
    } else if (method === "POST" && route === "endLiveStream") {
      result = await endLiveStream(body);
    } else if (method === "GET" && route === "songQueue") {
      result = await getSongQueue(query);
    } else if (method === "POST" && route === "setSongRequestStatus") {
      result = await setSongRequestStatus(body);
    } else if (method === "POST" && route === "followCreator") {
      result = await followCreator(body);
    } else if (method === "POST" && route === "unfollowCreator") {
      result = await unfollowCreator(body);
    } else if (method === "POST" && route === "addToWatchlist") {
      result = await addToWatchlist(body);
    } else if (method === "POST" && route === "removeFromWatchlist") {
      result = await removeFromWatchlist(body);
    } else if (method === "GET" && route === "myWatchlist") {
      result = await getMyWatchlist(query);
    } else if (method === "GET" && route === "continueWatching") {
      result = await getContinueWatching(query);
    } else if (method === "GET" && route === "myFollowing") {
      result = await getMyFollowing(query);
    } else if (method === "GET" && route === "followingFeed") {
      result = await getFollowingFeed(query);
    } else if (method === "POST" && route === "recordPlaybackProgress") {
      result = await recordPlaybackProgress(body);
    } else if (method === "GET" && route === "myViewingPreferences") {
      result = await getMyViewingPreferences();
    } else if (method === "POST" && route === "setMyViewingPreferences") {
      result = await setMyViewingPreferences(body);
    } else if (method === "POST" && route === "promptLogin") {
      await authentication.promptLogin({ mode: "login", modal: true });
      result = { loggedIn: true };
    } else if (method === "GET" && route === "listPendingContent") {
      result = await listPendingContent(query);
    } else if (method === "POST" && route === "moderateContent") {
      result = await moderateContent(body);
    } else if (method === "GET" && route === "listPendingRights") {
      result = await listPendingRights(query);
    } else if (method === "POST" && route === "reviewRightsDeclaration") {
      result = await reviewRightsDeclaration(body);
    } else if (method === "GET" && route === "listLiveChatReports") {
      result = await listLiveChatReports(query);
    } else if (method === "POST" && route === "resolveLiveChatReport") {
      result = await resolveLiveChatReport(body);
    } else if (method === "GET" && route === "mediaEngagement") {
      result = await getMediaEngagement(query);
    } else if (method === "GET" && route === "mediaComments") {
      result = await listComments(query);
    } else if (method === "POST" && route === "likeMedia") {
      result = await likeMedia(body);
    } else if (method === "POST" && route === "unlikeMedia") {
      result = await unlikeMedia(body);
    } else if (method === "POST" && route === "addComment") {
      result = await addComment(body);
    } else if (method === "POST" && route === "reportContent") {
      result = await reportContent(body);
    } else if (method === "GET" && route === "listContentReports") {
      result = await listContentReports(query);
    } else if (method === "POST" && route === "resolveContentReport") {
      result = await resolveContentReport(body);
    } else if (method === "GET" && route === "myPlaylists") {
      result = await getMyPlaylists(query);
    } else if (method === "POST" && route === "createPlaylist") {
      result = await createPlaylist(body);
    } else if (method === "GET" && route === "playlist") {
      result = await getPlaylist(query);
    } else if (method === "POST" && route === "addMediaToPlaylist") {
      result = await addMediaToPlaylist(body);
    } else if (method === "POST" && route === "removeMediaFromPlaylist") {
      result = await removeMediaFromPlaylist(body);
    } else if (method === "POST" && route === "updatePlaylist") {
      result = await updatePlaylist(body);
    } else if (method === "POST" && route === "deletePlaylist") {
      result = await deletePlaylist(body);
    } else if (method === "GET" && route === "myNotifications") {
      result = await getMyNotifications(query);
    } else if (method === "POST" && route === "markNotificationRead") {
      result = await markNotificationRead(body);
    } else if (method === "POST" && route === "markAllNotificationsRead") {
      result = await markAllNotificationsRead();
    } else {
      throw new Error("Unsupported MyOutlet request.");
    }
    sendResponse(id, true, result);
  } catch (error) {
    const message = error && typeof error.message === "string"
      ? error.message
      : "The MyOutlet request could not be completed.";
    sendResponse(id, false, message);
  }
}

$w.onReady(function () {
  window.addEventListener(REQUEST_EVENT, event => {
    handleRequest(event.detail);
  });
  window.__myOutletVeloReady = true;
  window.dispatchEvent(new CustomEvent(READY_EVENT));
});
