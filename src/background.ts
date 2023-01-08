const updateBadgeCount = async () => {
    const tabs = await chrome.tabs.query({});

    chrome.action.setBadgeText({
        text: tabs.length.toString()
    });
};

chrome.tabs.onCreated.addListener(() => updateBadgeCount());
chrome.tabs.onRemoved.addListener(() => updateBadgeCount());

chrome.runtime.onInstalled.addListener(() => {});

chrome.action.setBadgeBackgroundColor({
    color: "#1e293b"
});
