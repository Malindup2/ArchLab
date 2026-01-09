'use client';
import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

const TableNode = ({ data }: NodeProps) => {
    return (
        <div className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-md min-w-[150px] shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-[var(--primary)] text-white px-3 py-1 font-bold text-sm border-b border-[var(--border)] flex justify-between items-center">
                <span>{data.label}</span>
            </div>

            {/* Body (Fields) */}
            <div className="p-2 flex flex-col gap-1 bg-[var(--surface)]">
                {data.details && data.details.length > 0 ? (
                    data.details.map((field: string, i: number) => (
                        <div key={i} className="text-xs text-[var(--text-secondary)] font-mono border-b border-[var(--border-subtle)] last:border-0 pb-1">
                            {field}
                        </div>
                    ))
                ) : (
                    <div className="text-xs text-[var(--text-tertiary)] italic">No fields</div>
                )}
            </div>

            {/* Connection Handles */}
            <Handle type="target" position={Position.Top} className="!bg-[var(--text-secondary)] !w-3 !h-3" />
            <Handle type="source" position={Position.Bottom} className="!bg-[var(--text-secondary)] !w-3 !h-3" />
        </div>
    );
};

export default memo(TableNode);
