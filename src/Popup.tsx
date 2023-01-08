import { useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useHotkeys } from "react-hotkeys-hook";

import Tab from "./components/Tab";
import { clamp, reorder } from "./utils";

const Popup = () => {
    const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);
    const [selectedTab, setSelectedTab] = useState(0);
    const [modifier, setModifier] = useState(1);

    const updateCurrentTab = (delta: number) => {
        setSelectedTab((currTab) =>
            clamp(currTab + modifier * delta, 0, tabs.length - 1)
        );
    };

    useHotkeys("1, 2, 3, 4, 5, 6, 7, 8, 9", (_, handler) => {
        if (!handler.keys) {
            return;
        }
        let key = +handler.keys?.join("");

        if (isNaN(key)) {
            return;
        }

        setModifier(key);
    });

    useHotkeys(
        "j",
        () => {
            updateCurrentTab(1);
            setModifier(1);
        },
        [tabs, modifier]
    );

    useHotkeys(
        "ctrl+d",
        () => {
            updateCurrentTab(5);
            setModifier(1);
        },
        [tabs, modifier]
    );

    useHotkeys(
        "ctrl+u",
        () => {
            updateCurrentTab(-5);
            setModifier(1);
        },
        [tabs, modifier]
    );

    useHotkeys(
        "k",
        () => {
            updateCurrentTab(-1);
            setModifier(1);
        },
        [tabs, modifier]
    );

    useHotkeys(
        "x",
        () => {
            let tab = tabs[selectedTab];
            closeTab(tab);
        },
        [tabs, selectedTab]
    );

    useHotkeys(
        "enter",
        () => {
            focusTab(tabs[selectedTab]);
        },
        [selectedTab, tabs]
    );

    const loadTabs = async () => {
        let tabs = await chrome.tabs.query({});
        setTabs(tabs);
    };

    useEffect(() => {
        loadTabs();
    }, []);

    const focusTab = async (tab: chrome.tabs.Tab) => {
        if (!tab.id) {
            return;
        }

        await chrome.tabs.update(tab.id, { active: true });
        await chrome.windows.update(tab.windowId, { focused: true });
    };

    const closeTab = async (tab: chrome.tabs.Tab) => {
        if (!tab.id) {
            return;
        }

        await chrome.tabs.remove(tab.id);
        loadTabs();
        updateCurrentTab(0);
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return;
        }

        let updatedTabs = reorder(
            tabs,
            result.source.index,
            result.destination.index
        );

        setTabs(updatedTabs);
        chrome.tabs.move(+result.draggableId, {
            index: result.destination.index
        });
    };

    return (
        <div className="flex flex-col w-[500px] py-5 text-slate-50">
            <h1 className="font-medium mb-3 px-5 text-slate-400">Vitab</h1>

            <Scrollbars autoHeight autoHeightMax={450} className="flex-1">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="tabs">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                <ul className="px-5">
                                    {tabs.map((tab, index) => (
                                        <Tab
                                            selectedIndex={selectedTab}
                                            key={tab.id}
                                            index={index}
                                            tab={tab}
                                            onTabClicked={focusTab}
                                            onCloseClicked={closeTab}
                                        />
                                    ))}
                                    {provided.placeholder}
                                </ul>
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </Scrollbars>
        </div>
    );
};

export default Popup;
