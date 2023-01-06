import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";

import Tab from "./components/Tab";
import { reorder } from "./utils";

const App = () => {
    const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const loadTabs = async () => {
        let tabs = await chrome.tabs.query({});

        if (searchTerm && searchTerm != "") {
            let st = searchTerm.toLowerCase();
            tabs = tabs.filter(
                (tab) =>
                    tab.title?.toLowerCase().includes(st) ||
                    tab.url?.toLowerCase().includes(st)
            );
        }

        setTabs(tabs);
    };

    useEffect(() => {
        loadTabs();
    }, [searchTerm]);

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
        <div className="flex flex-col w-96 py-5 text-slate-50">
            <h1 className="font-medium mb-3 px-5 text-slate-400">Tabber</h1>

            <div className="relative rounded-md shadow-sm mb-3 mx-5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlassIcon className="h-4 w-4" />
                </div>
                <input
                    className="block w-full bg-slate-700 rounded-md border border-slate-600 p-2 pl-10 focus:border-slate-500 transition outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.currentTarget.value)}
                    autoFocus
                />
            </div>

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

export default App;
