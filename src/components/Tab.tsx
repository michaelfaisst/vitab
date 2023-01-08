import { XMarkIcon } from "@heroicons/react/24/solid";
import { Draggable } from "react-beautiful-dnd";
import classNames from "classnames";
import { useEffect, useRef } from "react";

interface Props {
    index: number;
    selectedIndex: number;
    tab: chrome.tabs.Tab;
    onTabClicked?: (tab: chrome.tabs.Tab) => void;
    onCloseClicked?: (tab: chrome.tabs.Tab) => void;
}

const Tab = ({
    index,
    selectedIndex,
    tab,
    onTabClicked,
    onCloseClicked
}: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (selectedIndex === index && containerRef.current) {
            containerRef.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        }
    }, [selectedIndex, index]);

    const isSelected = selectedIndex === index;

    return (
        <div ref={containerRef} className="flex flex-row items-center">
            <div
                className={classNames("basis-8 text-right pr-3", {
                    "text-slate-500": !isSelected,
                    "pr-5": isSelected
                })}
            >
                {isSelected ? index + 1 : Math.abs(selectedIndex - index)}
            </div>
            <Draggable draggableId={tab.id!.toString()} index={index}>
                {(provided) => (
                    <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={classNames(
                            "flex-1 relative flex flex-row transition-colors items-center gap-4 rounded-md bg-slate-700 hover:bg-slate-600 border border-slate-600 mb-2 py-2 px-4 cursor-pointer overflow-hidden",
                            { "bg-slate-600": isSelected }
                        )}
                        onClick={() => onTabClicked && onTabClicked(tab)}
                    >
                        {tab.highlighted && (
                            <div className="absolute inset-y-0 left-0 w-1 bg-green-400"></div>
                        )}
                        <div className="w-4 h-4 flex items-center">
                            {tab.favIconUrl && (
                                <img
                                    src={tab.favIconUrl}
                                    className="h-4 w-4 object-cover"
                                />
                            )}
                        </div>
                        <div className="flex-1 truncate">
                            <div className="truncate">{tab.title}</div>
                            <div className="text-slate-400 truncate">
                                {tab.url}
                            </div>
                        </div>

                        {onCloseClicked && (
                            <div
                                className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-md cursor-pointer bg-transparent hover:bg-slate-500 transition"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onCloseClicked(tab);
                                }}
                            >
                                <XMarkIcon className="w-3 h-3" />
                            </div>
                        )}
                    </li>
                )}
            </Draggable>
        </div>
    );
};

export default Tab;
