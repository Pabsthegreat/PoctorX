import AdminNav from "../components/AdminNav";
import OngoingTests from "../components/OngoingTests";

const AdminHome = () => {
  return (
    <div>
      <AdminNav />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'top', justifyContent: 'center', height: '40vh' }}>
        <h1 style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'top', 
                  justifyContent: 'center', 
                  height: '40vh',
                  fontSize: '30px',
                  fontWeight: 700,
                  color: '#F1F8FE', /* Softer blue for improved readability */
                  textShadow: '3px 3px 8px rgba(0, 0, 0, 0.7)',
                  marginLeft: '50px' /* Move the h1 a bit to the right */
         }} >Ongoing Tests</h1>
      </div>
      <OngoingTests />
    </div>
  );
};

export default AdminHome;
