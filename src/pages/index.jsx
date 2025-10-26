import Layout from "./Layout.jsx";

import Home from "./Home";

import ForEmployers from "./ForEmployers";

import ForTradespeople from "./ForTradespeople";

import CoreRecruit from "./CoreRecruit";

import JobBoard from "./JobBoard";

import ResumeCreator from "./ResumeCreator";

import CoreTradesDaily from "./CoreTradesDaily";

import Contact from "./Contact";

import Privacy from "./Privacy";

import Terms from "./Terms";

import EmployerDashboard from "./EmployerDashboard";

import TradespersonDashboard from "./TradespersonDashboard";

import AdminDashboard from "./AdminDashboard";

import EmployerJobNew from "./EmployerJobNew";

import AdminJobs from "./AdminJobs";

import AdminJobNew from "./AdminJobNew";

import AdminBlogs from "./AdminBlogs";

import AdminBlogNew from "./AdminBlogNew";

import AdminUsers from "./AdminUsers";

import AdminEmployers from "./AdminEmployers";

import HiringServices from "./HiringServices";

import CompleteProfile from "./CompleteProfile";

import JobDetail from "./JobDetail";

import EmployerJobEdit from "./EmployerJobEdit";

import AdminBlogEdit from "./AdminBlogEdit";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    ForEmployers: ForEmployers,
    
    ForTradespeople: ForTradespeople,
    
    CoreRecruit: CoreRecruit,
    
    JobBoard: JobBoard,
    
    ResumeCreator: ResumeCreator,
    
    CoreTradesDaily: CoreTradesDaily,
    
    Contact: Contact,
    
    Privacy: Privacy,
    
    Terms: Terms,
    
    EmployerDashboard: EmployerDashboard,
    
    TradespersonDashboard: TradespersonDashboard,
    
    AdminDashboard: AdminDashboard,
    
    EmployerJobNew: EmployerJobNew,
    
    AdminJobs: AdminJobs,
    
    AdminJobNew: AdminJobNew,
    
    AdminBlogs: AdminBlogs,
    
    AdminBlogNew: AdminBlogNew,
    
    AdminUsers: AdminUsers,
    
    AdminEmployers: AdminEmployers,
    
    HiringServices: HiringServices,
    
    CompleteProfile: CompleteProfile,
    
    JobDetail: JobDetail,
    
    EmployerJobEdit: EmployerJobEdit,
    
    AdminBlogEdit: AdminBlogEdit,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/ForEmployers" element={<ForEmployers />} />
                
                <Route path="/ForTradespeople" element={<ForTradespeople />} />
                
                <Route path="/CoreRecruit" element={<CoreRecruit />} />
                
                <Route path="/JobBoard" element={<JobBoard />} />
                
                <Route path="/ResumeCreator" element={<ResumeCreator />} />
                
                <Route path="/CoreTradesDaily" element={<CoreTradesDaily />} />
                
                <Route path="/Contact" element={<Contact />} />
                
                <Route path="/Privacy" element={<Privacy />} />
                
                <Route path="/Terms" element={<Terms />} />
                
                <Route path="/EmployerDashboard" element={<EmployerDashboard />} />
                
                <Route path="/TradespersonDashboard" element={<TradespersonDashboard />} />
                
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
                
                <Route path="/EmployerJobNew" element={<EmployerJobNew />} />
                
                <Route path="/AdminJobs" element={<AdminJobs />} />
                
                <Route path="/AdminJobNew" element={<AdminJobNew />} />
                
                <Route path="/AdminBlogs" element={<AdminBlogs />} />
                
                <Route path="/AdminBlogNew" element={<AdminBlogNew />} />
                
                <Route path="/AdminUsers" element={<AdminUsers />} />
                
                <Route path="/AdminEmployers" element={<AdminEmployers />} />
                
                <Route path="/HiringServices" element={<HiringServices />} />
                
                <Route path="/CompleteProfile" element={<CompleteProfile />} />
                
                <Route path="/JobDetail" element={<JobDetail />} />
                
                <Route path="/EmployerJobEdit" element={<EmployerJobEdit />} />
                
                <Route path="/AdminBlogEdit" element={<AdminBlogEdit />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}