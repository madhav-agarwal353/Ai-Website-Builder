import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { Project } from '../types';
import { Loader2Icon } from 'lucide-react';
import EditorPanel from './EditorPanel';
import { useLocation } from 'react-router-dom';

const iframeScript = `
        <style id="ai-preview-style">
        .ai-selected-element {
            outline: 2px solid #6366f1 !important;
        }
        </style>
        <script id="ai-preview-script">
        (function () {
            // If this HTML is opened directly (not in an iframe), do nothing.
            if (window === window.parent) {
            return;
            }

            let selectedElement = null;

            function clearSelected() {
            if (selectedElement) {
                selectedElement.classList.remove('ai-selected-element');
                selectedElement.removeAttribute('data-ai-selected');
                selectedElement.style.outline = '';
                selectedElement = null;
            }
            }

            document.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            clearSelected();

            const target = e.target;

            // Don't select body or html
            if (!target || target.tagName === 'BODY' || target.tagName === 'HTML') {
                window.parent.postMessage({ type: 'CLEAR_SELECTION' }, '*');
                return;
            }

            selectedElement = target;
            selectedElement.classList.add('ai-selected-element');
            selectedElement.setAttribute('data-ai-selected', 'true');

            const computedStyle = window.getComputedStyle(selectedElement);

            window.parent.postMessage({
                type: 'ELEMENT_SELECTED',
                payload: {
                tagName: selectedElement.tagName,
                className: selectedElement.className,
                text: selectedElement.innerText,
                styles: {
                    padding: computedStyle.padding,
                    margin: computedStyle.margin,
                    backgroundColor: computedStyle.backgroundColor,
                    color: computedStyle.color,
                    fontSize: computedStyle.fontSize
                }
                }
            }, '*');
            });

            window.addEventListener('message', function (event) {
            if (event.data.type === 'UPDATE_ELEMENT' && selectedElement) {
                const updates = event.data.payload;

                if (updates.className !== undefined) {
                selectedElement.className = updates.className;
                }

                if (updates.text !== undefined) {
                selectedElement.innerText = updates.text;
                }

                if (updates.styles) {
                Object.assign(selectedElement.style, updates.styles);
                }
            } else if (event.data.type === 'CLEAR_SELECTION_REQUEST') {
                clearSelected();

                // extra safety: remove our class + outline from any stray elements
                document.querySelectorAll('.ai-selected-element,[data-ai-selected]').forEach(function (el) {
                el.classList.remove('ai-selected-element');
                el.removeAttribute('data-ai-selected');
                el.style.outline = '';
                });
            }
            });
        })();
        </script>
`;
export interface ProjectPreviewRef {
    getCode: () => string | undefined;
}

interface ProjectPreviewProps {
    project: Project;
    isGenerate: boolean;
    device?: 'phone' | 'tablet' | 'desktop';
    showEditorPanel?: boolean;
}

export const ProjectPreview = forwardRef<ProjectPreviewRef, ProjectPreviewProps>(({ project, isGenerate, device = 'desktop', showEditorPanel = true }, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const [selectedElement, setselectedElement] = useState<any>(null)
    const resolution = {
        phone: 'w-[412px]',
        tablet: 'w-[768px]',
        desktop: 'w-full'
    }

    useImperativeHandle(ref, () => ({
        getCode: () => {
            const doc = iframeRef.current?.contentDocument;
            if (!doc) return undefined;
            doc.querySelectorAll('.ai-selected-element,[data-ai-selected]').forEach((element) => {
                element.classList.remove('ai-selected-element');
                element.removeAttribute('data-ai-selected');
                (element as HTMLElement).style.outline = '';
            })
            const previewsStyle = doc.getElementById('ai-preview-style');
            if (previewsStyle) previewsStyle.remove();
            const previewScript = doc.getElementById('ai-preview-script');
            if (previewScript) previewScript.remove();

            const html = doc.documentElement.outerHTML;
            return html;
        }
    }))

    const location = useLocation();
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'ELEMENT_SELECTED') {
                setselectedElement(event.data.payload);
            }
            else if (event.data.type === 'CLEAR_SELECTION') {
                setselectedElement(null);
            }
        }
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage)
    }, [])

    const handleUpdate = (updates: any) => {
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
                type: 'UPDATE_ELEMENT',
                payload: updates
            }, '*')
        }
    }


    // const injectPreview = (html: string) => {
    //     if (!html) return '';
    //     if (showEditorPanel) return html;
    //     if (html.includes('</body>')) {
    //         return html.replace('</body>', iframeScript + '</body>')
    //     }
    //     else {
    //         return html + iframeScript;
    //     }
    // }
    const injectPreview = (html: string) => {
        if (!html) return '';
        if (html.includes('</body>')) {
            return html.replace('</body>', iframeScript + '</body>');
        }
        return html + iframeScript;
    };

    return (
        <div className={location.pathname.startsWith('/projects') ? "h-[calc(100vh-80px)]" : "h-screen"}>
            {project.current_code ? (
                <>
                    <iframe
                        ref={iframeRef}
                        srcDoc={injectPreview(project.current_code)}
                        className={`h-full
                         max-sm:w-full ${resolution[device]} mx-auto transition-all purpple-scrollbar`}
                    />
                    {showEditorPanel && selectedElement && (
                        <EditorPanel selectedElement={selectedElement}
                            onUpdate={handleUpdate}
                            onClose={() => {
                                setselectedElement(null);
                                if (iframeRef.current?.contentWindow) {
                                    iframeRef.current.contentWindow.postMessage({ type: 'CLEAR_SELECTION_REQUEST' }, '*')
                                }
                            }} />
                    )}
                </>
            ) : isGenerate && (
                <Loader2Icon />
            )}
        </div>
    )
})

