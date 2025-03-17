import React from "react";
import Chatsupport from "./chatsupport";

const AdminChat = () => {
    return (
        <div>
            <h2>Admin Chat Support</h2>
            <Chatsupport isAdmin={true} />
        </div>
    );
};

export default AdminChat;