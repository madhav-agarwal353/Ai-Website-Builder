
import { XIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

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
            fontWeight?: string;
            borderRadius?: string;
            border?: string;
            textAlign?: string;
            opacity?: string;
        };
    } | null;
    onUpdate: (updates: any) => void;
    onClose: () => void;
}

const EditorPanel = ({ selectedElement, onUpdate, onClose }: EditorPanelProps) => {
    const [values, setValues] = useState(selectedElement);

    useEffect(() => {
        setValues(selectedElement);
    }, [selectedElement]);

    if (!selectedElement || !values) return null;

    const handleChange = (field: 'text' | 'className', value: string) => {
        const newValues = { ...values, [field]: value };
        setValues(newValues);
        onUpdate({ [field]: value });
    };

    const handleStyleChange = (styleName: string, value: string) => {
        const newStyles = { ...values.styles, [styleName]: value };
        setValues({ ...values, styles: newStyles });
        onUpdate({ styles: { [styleName]: value } });
    };

    return (
        <div className="fixed right-4 top-20 z-50 w-[380px] rounded-2xl
            bg-black/90 backdrop-blur-xl border border-white/10
            shadow-[0_12px_40px_rgba(0,0,0,0.7)] text-white">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3
                border-b border-white/10">
                <h3 className="text-sm font-semibold tracking-wide">
                    Edit Element
                    <span className="ml-2 rounded-md bg-white/10 px-2 py-0.5 text-xs text-indigo-400">
                        {values.tagName}
                    </span>
                </h3>

                <button
                    onClick={onClose}
                    className="rounded-lg p-1 hover:bg-white/10 transition"
                >
                    <XIcon className="h-4 w-4" />
                </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4 text-sm">
                {/* Text */}
                <div className="space-y-1">
                    <label className="text-white/60">Text Content</label>
                    <textarea
                        className="w-full min-h-[60px] rounded-xl bg-white/5
                            border border-white/10 px-3 py-2
                            focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={values.text}
                        onChange={(e) => handleChange('text', e.target.value)}
                    />
                </div>

                {/* Class */}
                <div className="space-y-1">
                    <label className="text-white/60">Class Name</label>
                    <input
                        type="text"
                        className="w-full rounded-xl bg-white/5
                            border border-white/10 px-3 py-2"
                        value={values.className || ''}
                        onChange={(e) => handleChange('className', e.target.value)}
                    />
                </div>

                {/* Spacing */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-white/60">Padding</label>
                        <input
                            type="text"
                            className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2"
                            value={values.styles.padding}
                            onChange={(e) => handleStyleChange('padding', e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-white/60">Margin</label>
                        <input
                            type="text"
                            className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2"
                            value={values.styles.margin}
                            onChange={(e) => handleStyleChange('margin', e.target.value)}
                        />
                    </div>
                </div>

                {/* Typography */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-white/60">Font Size</label>
                        <input
                            type="text"
                            className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2"
                            value={values.styles.fontSize}
                            onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-white/60">Font Weight</label>
                        <select
                            className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2"
                            value={values.styles.fontWeight || '400'}
                            onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                        >
                            <option value="300">Light</option>
                            <option value="400">Regular</option>
                            <option value="600">Semibold</option>
                            <option value="700">Bold</option>
                        </select>
                    </div>
                </div>

                {/* Layout */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-white/60">Text Align</label>
                        <select
                            className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2"
                            value={values.styles.textAlign || 'left'}
                            onChange={(e) => handleStyleChange('textAlign', e.target.value)}
                        >
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-white/60">Opacity</label>
                        <input
                            type="number"
                            min="0"
                            max="1"
                            step="0.05"
                            className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2"
                            value={values.styles.opacity || '1'}
                            onChange={(e) => handleStyleChange('opacity', e.target.value)}
                        />
                    </div>
                </div>

                {/* Colors & Shape */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-white/60">Background</label>
                        <input
                            type="color"
                            className="h-9 w-full rounded-lg border border-white/20 bg-transparent"
                            value={values.styles.backgroundColor}
                            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-white/60">Text Color</label>
                        <input
                            type="color"
                            className="h-9 w-full rounded-lg border border-white/20 bg-transparent"
                            value={values.styles.color}
                            onChange={(e) => handleStyleChange('color', e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-white/60">Border Radius</label>
                    <input
                        type="text"
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2"
                        value={values.styles.borderRadius || ''}
                        onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default EditorPanel;
