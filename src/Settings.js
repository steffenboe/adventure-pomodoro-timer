import ReactSlider from "react-slider";
import "./slider.css";
import { useContext } from "react";
import SettingsContext from "./SettingsContext";

function Settings() {
  const settingsInfo = useContext(SettingsContext);

  return (
    <div style={{ textAlign: "left" }}>
      <label>work minutes: {settingsInfo.workMinutes}:00</label>
      <ReactSlider
        className={"slider"}
        thumbClassName={"thumb"}
        trackClassName={"track"}
        value={settingsInfo.workMinutes}
        min={1}
        max={120}
        onChange={(newValue) => settingsInfo.setWorkMinutes(newValue)}
      />
      <label>short break minutes: {settingsInfo.breakMinutes}:00</label>
      <ReactSlider
        className={"slider green"}
        thumbClassName={"thumb"}
        trackClassName={"track"}
        value={settingsInfo.breakMinutes}
        min={1}
        max={15}
        onChange={(newValue) => settingsInfo.setBreakMinutes(newValue)}
      />
      <label>long break minutes: {settingsInfo.longBreakMinutes}:00</label>
      <ReactSlider
        className={"slider green"}
        thumbClassName={"thumb"}
        trackClassName={"track"}
        value={settingsInfo.longBreakMinutes}
        min={1}
        max={15}
        onChange={(newValue) => settingsInfo.setLongBreakMinutes(newValue)}
      />
      <div style={{textAlign: 'center', marginTop: '20px'}}>
        <button className="with-text" onClick={ () => settingsInfo.setShowSettings(false)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </button>
      </div>
    </div>
  );
}

export default Settings;
