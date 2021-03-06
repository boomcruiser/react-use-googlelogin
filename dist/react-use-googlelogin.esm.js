import { useEffect, useState, useRef } from 'react';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

// A type of promise-like that resolves synchronously and supports only one observer

const _iteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))) : "@@iterator";

const _asyncIteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))) : "@@asyncIterator";

// Asynchronously call a function and send errors to recovery continuation
function _catch(body, recover) {
	try {
		var result = body();
	} catch(e) {
		return recover(e);
	}
	if (result && result.then) {
		return result.then(void 0, recover);
	}
	return result;
}

/**
 * Loads an internal script into a tag under the provided `id`. Useful for libraries
 * such as Stripe checkout and Google maps.
 * @private
 *
 * @param id - ID to give the created DOM node.
 * @param src - URL to load the script from.
 * @param callback - Callback to run when the script is loaded.
 */

var useExternalScript = function useExternalScript(id, src, callback) {
  useEffect(function () {
    var isLoaded = Boolean(document.getElementById(id));
    if (isLoaded) return;
    var script = document.createElement('script');
    script.src = src;
    script.id = id;
    document.body.appendChild(script);
    if (callback) script.onload = callback;
    if (isLoaded && callback) callback(); // We're missing deps here, but we really only want to call this once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

var GOOGLE_API_URL = 'https://apis.google.com/js/api.js';
var DOM_ID = '___GOOGLE_LOGIN___';

/**
 * Retrieves basic profile information for a given user.
 * @private
 *
 * @param user - `GoogleUser` instance to get basic info on.
 */

var getAdditionalUserData = function getAdditionalUserData(user, fetchBasicProfile) {
  var authResponse = user.getAuthResponse();
  user.tokenObj = authResponse;
  user.tokenId = authResponse.id_token;
  user.accessToken = authResponse.access_token;
  user.expiresAt = authResponse.expires_at;
  if (!fetchBasicProfile) return;
  var basicProfile = user.getBasicProfile();
  user.googleId = basicProfile.getId();
  user.profileObj = {
    googleId: basicProfile.getId(),
    imageUrl: basicProfile.getImageUrl(),
    email: basicProfile.getEmail(),
    name: basicProfile.getName(),
    givenName: basicProfile.getGivenName(),
    familyName: basicProfile.getFamilyName()
  };
};
/**
 * React hook for working with the google oAuth client library.
 *
 * @param config - The configuration for your Google authentication flow.
 *
 * @returns The `GoogleUser` instance with properties to work with Google
 * client authentication.
 */


var useGoogleLogin = function useGoogleLogin(_ref) {
  var clientId = _ref.clientId,
      hostedDomain = _ref.hostedDomain,
      redirectUri = _ref.redirectUri,
      apiKey = _ref.apiKey,
      _ref$scope = _ref.scope,
      scope = _ref$scope === void 0 ? 'profile email openid' : _ref$scope,
      _ref$cookiePolicy = _ref.cookiePolicy,
      cookiePolicy = _ref$cookiePolicy === void 0 ? 'single_host_origin' : _ref$cookiePolicy,
      _ref$fetchBasicProfil = _ref.fetchBasicProfile,
      fetchBasicProfile = _ref$fetchBasicProfil === void 0 ? true : _ref$fetchBasicProfil,
      _ref$uxMode = _ref.uxMode,
      uxMode = _ref$uxMode === void 0 ? 'popup' : _ref$uxMode,
      _ref$persist = _ref.persist,
      persist = _ref$persist === void 0 ? true : _ref$persist;
  if (!clientId) throw new Error('clientId is required.');

  var _useState = useState({
    googleUser: undefined,
    auth2: undefined,
    isSignedIn: false,
    clientInitialized: false,
    isInitialized: false
  }),
      state = _useState[0],
      setState = _useState[1];

  var latestAccessTokenRef = useRef(undefined);
  var latestExpiresAtRef = useRef(undefined);
  /**
   * Attempts to sign in a user with Google's oAuth2 client.
   * @public
   *
   * @param options - Configutation parameters for GoogleAuth.signIn()
   * @returns The GoogleUser instance for the signed in user.
   */

  var signIn = function signIn(options) {
    try {
      var auth2 = window.gapi.auth2.getAuthInstance();
      return Promise.resolve(_catch(function () {
        return Promise.resolve(auth2.signIn(options)).then(function (googleUser) {
          getAdditionalUserData(googleUser, fetchBasicProfile);
          return googleUser;
        });
      }, function (err) {
        if (process.env.NODE_ENV !== "production") console.error('Received error when signing in: ' + (err === null || err === void 0 ? void 0 : err.details));
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  /**
   * Signs out and disconnects the oAuth2 client. Sets `googleUser` to undefined.
   * @public
   *
   * @returns `true` if successful, `false` otherwise.
   */


  var signOut = function signOut() {
    try {
      var auth2 = window.gapi.auth2.getAuthInstance();
      if (!auth2) return Promise.resolve(false);
      return Promise.resolve(auth2.signOut()).then(function () {
        auth2.disconnect();
        return true;
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  /**
   * Attempts to get permission from the user to access the specified `scopes` offline.
   * If the user grants access, this function will return the `authorizationCode` that
   * can be exchanged for a `refreshToken` on your own server or backend service.
   * @public
   *
   * @remarks
   * You must sign in a user with this function in order to retain access for longer
   * than 1 hour.
   *
   * @param options - Configuration options for granting offline access.
   * @returns The authorization `code` if permission was granted, `undefined` otherwise.
   */


  var grantOfflineAccess = function grantOfflineAccess(options) {
    try {
      var auth2 = window.gapi.auth2.getAuthInstance();
      return Promise.resolve(_catch(function () {
        return Promise.resolve(auth2.grantOfflineAccess(options)).then(function (_ref2) {
          var code = _ref2.code;
          return code;
        });
      }, function (err) {
        if (process.env.NODE_ENV !== "production") console.error('Received error when granting offline access: ' + (err === null || err === void 0 ? void 0 : err.details));
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  /**
   * Refreshes the current logged in user's `accessToken`.
   *
   * @remarks
   * To use this function, the user must have signed in via `grantOfflineAccess`.
   *
   * @returns An object containing the new `accessToken` and its corresponding
   * `expiresAt`.
   */


  var refreshUser = function refreshUser() {
    try {
      return Promise.resolve(_catch(function () {
        var auth2 = window.gapi.auth2.getAuthInstance();
        var googleUser = auth2.currentUser.get();
        return Promise.resolve(googleUser === null || googleUser === void 0 ? void 0 : googleUser.reloadAuthResponse()).then(function (tokenObj) {
          if (!tokenObj) {
            if (process.env.NODE_ENV !== "production") console.error('Something went wrong refreshing the current user.');
            return;
          }

          latestAccessTokenRef.current = tokenObj.access_token;
          latestExpiresAtRef.current = tokenObj.expires_at;
          return {
            accessToken: tokenObj.access_token,
            expiresAt: tokenObj.expires_at
          };
        });
      }, function (err) {
        if (process.env.NODE_ENV !== "production") console.error('Received error when refreshing tokens: ' + (err === null || err === void 0 ? void 0 : err.details));
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  /**
   * Callback function passed to Google's auth listener. This is the primary
   * mechanism to keep the hook's state/return values in sync with Google's
   * window `gapi` objects. All stateful logic **should** be performed in
   * here.
   * @private
   *
   * @remarks
   * Due to the way closures work, we cannot access `state` directly
   * in this function. (yay stale closures) Normally we'd instantiate and
   * disconnect the listener on every render so we have the correct `state`
   * values but Google doesn't provide a way to disconnect their listener. Go figure.
   *
   * This function **also** may not be called with the most up-to-date `GoogleUser`.
   * Google decided that `reloadAuthResponse` will invoke this listener, but not
   * actually provide a `googleUser` object with the most up-to-date tokens.
   * In most auth change scenarios this isn't an issue except when refreshing
   * with `refreshUser`.
   *
   * To remedy this, we need to keep a ref that tracks the latest `accessToken`
   * and `expiresAt` values whenever we refresh, and use those instead when they're
   * available since they'll contain the up-to-date values.
   *
   * It's worth noting that we could just use the callback version `setState` here,
   * and update state in `refreshUser`, but this causes causes an additional re-render
   * by setting state twice. React's batching **could* help here, but it is pretty
   * un-deterministic and in my testing wouldn't kick in this particular case.
   *
   * @param googleUser GoogleUser object from the `currentUser` property.
   */


  var DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']; // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  // var SCOPES = 'https://www.googleapis.com/auth/calendar.events'

  var initClient = function initClient() {
    gapi.client.init({
      apiKey: apiKey,
      // clientId,
      discoveryDocs: DISCOVERY_DOCS
    }).then(function () {
      console.log('calendar init');
      setState(_extends({}, state, {
        clientInitialized: true
      }));
    }, function (error) {
      console.log({
        error: error
      });
      setState(_extends({}, state, {
        error: error
      })); // appendPre(JSON.stringify(error, null, 2))
    });
  };

  var handleAuthChange = function handleAuthChange(googleUser) {
    var _latestAccessTokenRef, _latestExpiresAtRef$c, _latestAccessTokenRef2, _latestExpiresAtRef$c2;

    var isSignedIn = googleUser.isSignedIn();
    var auth2 = window.gapi.auth2.getAuthInstance(); // If `tokenId` is present, we've already performed this step so skip it.

    if (isSignedIn && !googleUser.tokenId) getAdditionalUserData(googleUser, fetchBasicProfile);
    setState(_extends({}, state, {
      auth2: auth2,
      googleUser: isSignedIn ? _extends({}, googleUser, {
        accessToken: (_latestAccessTokenRef = latestAccessTokenRef.current) !== null && _latestAccessTokenRef !== void 0 ? _latestAccessTokenRef : googleUser.accessToken,
        expiresAt: (_latestExpiresAtRef$c = latestExpiresAtRef.current) !== null && _latestExpiresAtRef$c !== void 0 ? _latestExpiresAtRef$c : googleUser.expiresAt,
        tokenObj: _extends({}, googleUser.tokenObj, {
          access_token: (_latestAccessTokenRef2 = latestAccessTokenRef.current) !== null && _latestAccessTokenRef2 !== void 0 ? _latestAccessTokenRef2 : googleUser.tokenObj.access_token,
          expires_at: (_latestExpiresAtRef$c2 = latestExpiresAtRef.current) !== null && _latestExpiresAtRef$c2 !== void 0 ? _latestExpiresAtRef$c2 : googleUser.tokenObj.expires_at
        })
      }) : undefined,
      isSignedIn: isSignedIn,
      isInitialized: true
    }));
  };

  useExternalScript(DOM_ID, GOOGLE_API_URL, function () {
    /**
     * According to Google's documentation:
     *
     * Warning: do not call Promise.resolve() or similar with the result of gapi.auth2.init().
     * The GoogleAuth object returned implements the `then()` method which resolves with itself.
     * As a result, `Promise.resolve()` or `await` will cause infinite recursion.
     */
    var handleLoad = function handleLoad() {
      var config = {
        client_id: clientId,
        cookie_policy: cookiePolicy,
        hosted_domain: hostedDomain,
        fetch_basic_profile: fetchBasicProfile,
        ux_mode: uxMode,
        redirect_uri: redirectUri,
        scope: scope
      };
      window.gapi.auth2.init(config).then(function (auth2) {
        var googleUser = auth2.currentUser.get();
        var isSignedIn = googleUser.isSignedIn();
        auth2.currentUser.listen(handleAuthChange);

        if (!persist) {
          signOut();
          return;
        }

        if (isSignedIn) {
          getAdditionalUserData(googleUser, fetchBasicProfile);
        }

        setState(_extends({}, state, {
          googleUser: googleUser,
          auth2: auth2,
          isSignedIn: isSignedIn,
          isInitialized: true
        }));
        gapi.load('client:auth2', initClient);
      }, function (err) {
        setState(_extends({}, state, {
          googleUser: undefined,
          auth2: undefined,
          isSignedIn: false,
          isInitialized: false,
          error: err
        }));
      });
    };

    window.gapi.load('auth2', handleLoad);
  });
  return _extends({}, state, {
    signIn: signIn,
    signOut: signOut,
    grantOfflineAccess: grantOfflineAccess,
    refreshUser: refreshUser
  });
};

export { useGoogleLogin };
//# sourceMappingURL=react-use-googlelogin.esm.js.map
