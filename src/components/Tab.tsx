import { XMarkIcon } from "@heroicons/react/24/solid";
import { Draggable } from "react-beautiful-dnd";

interface Props {
    index: number;
    tab: chrome.tabs.Tab;
    onTabClicked?: (tab: chrome.tabs.Tab) => void;
    onCloseClicked?: (tab: chrome.tabs.Tab) => void;
}

const Tab = ({ index, tab, onTabClicked, onCloseClicked }: Props) => {
    return (
        <Draggable draggableId={tab.id!.toString()} index={index}>
            {(provided) => (
                <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="relative flex flex-row transition-colors items-center gap-4 rounded-md bg-slate-700 hover:bg-slate-600 border border-slate-600 mb-3 p-4 cursor-pointer"
                    onClick={() => onTabClicked && onTabClicked(tab)}
                >
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
                        <div className="text-slate-400 truncate">{tab.url}</div>
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
    );
};

export default Tab;
