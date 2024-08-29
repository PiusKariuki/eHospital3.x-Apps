import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import styles from "./root.scss";
import OverviewComponent from "./components/overview.component";
import ScheduledOverviewComponent from "./components/scheduled-overview.component";
import { spaBasePath } from "./constants";
import WebViewComponent from "./components/web-view/web-view.component";

const RootComponent: React.FC = () => {
  return (
    <div className={styles.container}>
      <BrowserRouter basename={spaBasePath}>
        <Routes>
          <Route path="/" element={<OverviewComponent />} />
          <Route
            path="/scheduled-overview"
            element={<ScheduledOverviewComponent />}
          />
          <Route path="/webview/:reportUuid" element={<WebViewComponent />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default RootComponent;
