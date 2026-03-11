import Sidebar from "../Components/Sidebar";

const ChatLayout = ({ children }) => {

  return (

    <div className="app-layout">

      <Sidebar />

      <div className="main-content">
        {children}
      </div>

    </div>

  );

};

export default ChatLayout;