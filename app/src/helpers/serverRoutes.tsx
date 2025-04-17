export const ServerRoutes = {
    auth: {
      authentication: (type: string, query: string = '') => `/auth/${type}${query}`,
      resetPassword: () => '/reset',
      changePassword: () => '/changepassword'
    },
  
    userRoutes: {
      userInfo: (id: string) => `/user/${id}`,
      searchUsers: (username: string) => `/search/${username}`,
      profile: (id: string) => `/profile/${id}`,
      updateProfile: () => '/updateprofile',
      updateProfilePicture: () => '/updateprofilepicture',
      notifications: () => '/notification',
      requests: (action?: string) => `/requests/${action || ''}`
    },
  
    postRoutes: {
      content: (id: string = '', query: string = '') => `/content/${id}${query}`,
      comments: (postId: string, parentId: string = '') => `/content/${postId}/comments/${parentId}`,
      interact: (id: string) => `/content/${id}/interact`
    },
  
    chatRoutes: {
      inbox: () => '/inbox',
      getMessages: (chatboxid: string) => `/getmessages/${chatboxid}`
    }
  };
  