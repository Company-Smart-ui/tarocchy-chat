export const responses = {
    failure: 0,
    success: 1,
    notFound: 2,
    serverError: 3,
    unauthorized: 4,
    empty: 5,
    loginRequired: 6,
    invalidAccountType: 7,
    invalidPassword: 8,

    registerAccount: {
        duplicate: 500, //account with username already exists
        invalidPassword: 501, //password does not meet requirements
        invalidAccountType: 502, //can be replaced now with #7
    },
    authenticateAccount: {
        alreadyLoggedIn: 500,
        invalidAccountType: 501, //can be replaced now with #7
    },
    chatRequestCreateRequest: {
        insufficientBalance: 500,
        multiplePendingRequestsError: 501, //means there is another request already pending
        agentExceededMaximumOngoingChats: 502,
    },
    getChatlog: {
        all: 500, //gets all chat logs, not just 1 rooms log
    },
    generateCouponsRequest: {
        maximumCouponCountExceeded: 500,
    },
    redeemCoupon: {
        alreadyRedeemed: 500,
    },
    chatRoomClosed: {
        unknown: -1,
        chatTimeEnded: 1000,
        guestLeft: 1001,
        agentLeft: 1002,
        insufficientBalance: 500,

        chatRequestTimeout: 2000,
        agentRejectedChat: 2001,
    },
};

export const events = {
    login: "login",
    disconnected: "disconnected",
    authenticateAccountRequest: "authenticateAccountRequest",
    authenticateAccountResponse: "authenticateAccountResponse",
    registerAccountRequest: "registerAccountRequest",
    registerAccountResponse: "registerAccountResponse",
    chatRequestCreateRequest: "chatRequestCreateRequest",
    chatRequestCreateResponse: "chatRequestCreateResponse",
    agentStatusRequest: "agentStatusRequest",
    agentStatusResponse: "agentStatusResponse",
    setStatusRequest: "setStatusRequest",
    deleteAccountRequest: "deleteAccountRequest",
    deleteAccountResponse: "deleteAccountResponse",
    getChatlogRequest: "getChatlogRequest",
    getChatlogResponse: "getChatlogResponse",
    generateCouponsRequest: "generateCouponsRequest",
    generateCouponsResponse: "generateCouponsResponse",
    redeemCouponRequest: "redeemCouponRequest",
    redeemCouponResponse: "redeemCouponResponse",
    userDetailsRequest: "userDetailsRequest",
    userDetailsResponse: "userDetailsResponse",
    agentDetailsRequest: "agentDetailsRequest",
    agentDetailsResponse: "agentDetailsResponse",
    changeAgentDetailsRequest: "changeAgentDetailsRequest",
    changeAgentDetailsResponse: "changeAgentDetailsResponse",
    changeUserDetailsRequest: "changeUserDetailsRequest",
    changeUserDetailsResponse: "changeUserDetailsResponse",
    changeAdminDetailsRequest: "changeAdminDetailsRequest",
    changeAdminDetailsResponse: "changeAdminDetailsResponse",
    getActiveChatRoomsRequest: "getActiveChatRoomsRequest",
    getActiveChatRoomsResponse: "getActiveChatRoomsResponse",
    rejoinChatRoomRequest: "rejoinChatRoomRequest",
    rejoinChatRoomResponse: "rejoinChatRoomResponse",
    chatRequestCancelRequest: "chatRequestCancelRequest",
    chatRequestCancelResponse: "chatRequestCancelResponse",

    leaveRoomRequest: "leaveRoomRequest",
    leaveRoomResponse: "leaveRoomResponse",

    sendMessageRequest: "sendMessageRequest",
    sendMessageResponse: "sendMessageResponse",
    chatRequestAcceptRequest: "chatRequestAcceptRequest",
    chatRequestAcceptResponse: "chatRequestAcceptResponse",

    phoneStatusChange: "phoneStatusChange",
    setPhoneStatusRequest: "setPhoneStatusRequest",




    connected: "connected",
    messageReceived: "messageReceived",
    chatRoomOpened: "chatRoomOpened",
    chatRoomClosed: "chatRoomClosed",
    statusChange: "statusChange",
    balanceUpdated: "balanceUpdated",
    chatRequestFateUpdate: "chatRequestFateUpdate",
    chatTimeUpdate: "chatTimeUpdate",
    payAsYouGoTimeExtended: "payAsYouGoTimeExtended",

    setAgentProfilePictureResponse: "setAgentProfilePictureResponse",
    setAgentProfilePictureRequest: "setAgentProfilePictureRequest",

    downloadAgentProfilePictureResponse: "downloadAgentProfilePictureResponse",
    downloadAgentProfilePictureRequest: "downloadAgentProfilePictureRequest",

    allAgentPINsRequest: "allAgentPINsRequest",
    allAgentPINsResponse: "allAgentPINsResponse",

    getReviewsRequest: "getReviewsRequest",
    getReviewsResponse: "getReviewsResponse",

    deleteReviewRequest: "deleteReviewRequest",
    deleteReviewResponse: "deleteReviewResponse",
};
export const chatRequestStatus = {
    accepted: 0,
    rejected: 1,
    active: 2,
};
export const userStatus = {
    online: 0,
    busy: 1,
    away: 2,
    offline: -1, //user cannot have this state, only used to send response to client agent status requests
};
export const accountType = {
    guest: 0,
    agent: 1,
    admin: 2,
};
export const discounts = {
    discount1: 0,
    discount2: 0.05,
    discount3: 0.066,
};
export const discountMinutes = {
    discount0: 0,
    discount1: 10,
    discount2: 20,
    discount3: 30,
};

export const chatRoomType = {
    payAsYouGo: 0,
    fixed10: 1,
    fixed20: 2,
    fixed30: 3,
};
