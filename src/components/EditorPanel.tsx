import { XIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react'

interface EditorPanelProps {
    selectedElement: {
        tagName: string;
        className: string;
        text: string;
        styles: {
            padding: string;
            margin: string;
            backgroundColor: string;
            color: string;
            fontSize: string;
        };
    } | null;
    onUpdate: (updates: any) => void;
    onClose: () => void;
}

const EditorPanel = ({ selectedElement, onUpdate, onClose }: EditorPanelProps) => {

    const [values, setValues] = useState(selectedElement);

    useEffect(() => {
        setValues(selectedElement)
    }, [selectedElement])

    if (!selectedElement || !values)
        return null;
    const handleChange = async (field: string, value: string) => {
        const newValues = { ...values, [field]: value };
        if (field in values.styles) {
            newValues.styles = { ...values.styles, [field]: value }
        }
        setValues(newValues)
        onUpdate({ [field]: value });
    }
    return (
        <div className=''>
            <div>
                <h3>Edit Element</h3>
                <button onClick={onClose}>
                    <XIcon />
                </button>
            </div>
            <div>
                <div>
                    <label htmlFor="">
                        Text Content
                    </label>
                    <textarea value={values.text} onChange={(e) => handleChange('text', e.target.value)} />
                </div>
                <div>
                    <label htmlFor="">
                        Class Name
                    </label>
                    <input type='text' value={values.className || ''} onChange={(e) => handleChange('className', e.target.value)} />
                </div>
                <div className=''>
                     <div>
                        
                     </div>
                </div>
            </div>
        </div>
    )
}

export default EditorPanel