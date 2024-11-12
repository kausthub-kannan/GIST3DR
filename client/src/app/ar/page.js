import React from "react";
import AframeARRender from "@/components/model-renders/aframe-ar-render";
import ThreeJSARRender from "@/components/model-renders/threejs-ar-render";

export default function ARPage() {
  return (
    <div>
      {/* <AframeARRender /> */}
      <ThreeJSARRender />
    </div>
  );
}
