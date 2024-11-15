"use client"
import Screw3DRender from "@/components/model-renders/screw-3d-render";
import Bones3DRender from "@/components/model-renders/bones-3d-render";
import { useState } from 'react';

export default function DashboardPage() {
  const [screwParams, setScrewParams] = useState({
    screwHeight: 0.75,
    screwRadius: 0.43,
    headHeight: 0.4
  });

  const handleParamChange = (param, value) => {
    setScrewParams(prev => ({
      ...prev,
      [param]: parseFloat(value)
    }));
  };

  return (
    <div className="flex flex-row p-4 gap-4">
      <div className="w-1/2">
        <Bones3DRender modelPath="/models/label_2.obj" />
      </div>
      <div className="w-1/2">
        <div className="mb-4 space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Screw Height</label>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.05"
              value={screwParams.screwHeight}
              onChange={(e) => handleParamChange('screwHeight', e.target.value)}
              className="w-full"
            />
            <span className="text-sm">{screwParams.screwHeight}</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Screw Radius</label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.01"
              value={screwParams.screwRadius}
              onChange={(e) => handleParamChange('screwRadius', e.target.value)}
              className="w-full"
            />
            <span className="text-sm">{screwParams.screwRadius}</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Head Height</label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={screwParams.headHeight}
              onChange={(e) => handleParamChange('headHeight', e.target.value)}
              className="w-full"
            />
            <span className="text-sm">{screwParams.headHeight}</span>
          </div>
        </div>
        <Screw3DRender
          containerWidth="100%"
          containerHeight="500px"
          {...screwParams}
        />
      </div>
    </div>
  );
}
