import React from "react";
import VoteMain from "./VoteView/VoteMain";

function App() {
  return (
    <div style={{
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none'
    }}>
      <VoteMain />
    </div>
  );
}

export default App;
