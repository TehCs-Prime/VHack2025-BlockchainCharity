import React from 'react';
import './Page-Approach.css';

const DonorIcon = () => (
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  style={{ fill: 'rgba(255, 215, 0, 1)', transform: '', msFilter: '' }}
>
<path d="M12.186 14.552c-.617 0-.977.587-.977 1.373 0 .791.371 1.35.983 1.35.617 0 .971-.588.971-1.374 0-.726-.348-1.349-.977-1.349z"></path><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM9.155 17.454c-.426.354-1.073.521-1.864.521-.475 0-.81-.03-1.038-.06v-3.971a8.16 8.16 0 0 1 1.235-.083c.768 0 1.266.138 1.655.432.42.312.684.81.684 1.522 0 .775-.282 1.309-.672 1.639zm2.99.546c-1.2 0-1.901-.906-1.901-2.058 0-1.211.773-2.116 1.967-2.116 1.241 0 1.919.929 1.919 2.045-.001 1.325-.805 2.129-1.985 2.129zm4.655-.762c.275 0 .581-.061.762-.132l.138.713c-.168.084-.546.174-1.037.174-1.397 0-2.117-.869-2.117-2.021 0-1.379.983-2.146 2.207-2.146.474 0 .833.096.995.18l-.186.726a1.979 1.979 0 0 0-.768-.15c-.726 0-1.29.438-1.29 1.338 0 .809.48 1.318 1.296 1.318zM14 9h-1V4l5 5h-4z"></path><path d="M7.584 14.563c-.203 0-.335.018-.413.036v2.645c.078.018.204.018.317.018.828.006 1.367-.449 1.367-1.415.006-.84-.485-1.284-1.271-1.284z"></path>
</svg>
  );
  
  const MoneyIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      style={{ fill: 'rgba(255, 215, 0, 1)', transform: '', msFilter: '' }}
    >
  <path d="M12 15c-1.84 0-2-.86-2-1H8c0 .92.66 2.55 3 2.92V18h2v-1.08c2-.34 3-1.63 3-2.92 0-1.12-.52-3-4-3-2 0-2-.63-2-1s.7-1 2-1 1.39.64 1.4 1h2A3 3 0 0 0 13 7.12V6h-2v1.09C9 7.42 8 8.71 8 10c0 1.12.52 3 4 3 2 0 2 .68 2 1s-.62 1-2 1z"></path><path d="M5 2H2v2h2v17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V4h2V2H5zm13 18H6V4h12z"></path>    </svg>
      );

  const CheckIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      style={{ fill: 'rgba(255, 215, 0, 1)', transform: '', msFilter: '' }}
    >
    <path d="M8 12.052c1.995 0 3.5-1.505 3.5-3.5s-1.505-3.5-3.5-3.5-3.5 1.505-3.5 3.5 1.505 3.5 3.5 3.5zM9 13H7c-2.757 0-5 2.243-5 5v1h12v-1c0-2.757-2.243-5-5-5zm11.294-4.708-4.3 4.292-1.292-1.292-1.414 1.414 2.706 2.704 5.712-5.702z"></path>    </svg>
      );

  const GovIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      style={{ fill: 'rgba(255, 215, 0, 1)', transform: '', msFilter: '' }}
    >
  <path d="M2 8v4.001h1V18H2v3h16l3 .001V21h1v-3h-1v-5.999h1V8L12 2 2 8zm4 10v-5.999h2V18H6zm5 0v-5.999h2V18h-2zm7 0h-2v-5.999h2V18zM14 8a2 2 0 1 1-4.001-.001A2 2 0 0 1 14 8z"></path>    </svg>
      );
  
  const CharityIcon = () => (
    <svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  style={{ fill: 'rgba(255, 215, 0, 1)', transform: '', msFilter: '' }}
>
  <path d="M16 12h2v4h-2z"></path><path d="M20 7V5c0-1.103-.897-2-2-2H5C3.346 3 2 4.346 2 6v12c0 2.201 1.794 3 3 3h15c1.103 0 2-.897 2-2V9c0-1.103-.897-2-2-2zM5 5h13v2H5a1.001 1.001 0 0 1 0-2zm15 14H5.012C4.55 18.988 4 18.805 4 18V8.815c.314.113.647.185 1 .185h15v10z"></path></svg>  );
  
  const LocalNGOIcon = () => (
    <svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  style={{ fill: 'rgba(255, 215, 0, 1)', transform: '', msFilter: '' }}
>
<path d="m11.953 8.819-.547 2.19c.619.154 2.529.784 2.838-.456.322-1.291-1.673-1.579-2.291-1.734zm-.822 3.296-.603 2.415c.743.185 3.037.921 3.376-.441.355-1.422-2.029-1.789-2.773-1.974z"></path><path d="M14.421 2.299C9.064.964 3.641 4.224 2.306 9.581.97 14.936 4.23 20.361 9.583 21.697c5.357 1.335 10.783-1.924 12.117-7.281 1.336-5.356-1.924-10.781-7.279-12.117zm1.991 8.275c-.145.974-.686 1.445-1.402 1.611.985.512 1.485 1.298 1.009 2.661-.592 1.691-1.998 1.834-3.87 1.48l-.454 1.82-1.096-.273.447-1.794a44.624 44.624 0 0 1-.875-.228l-.449 1.804-1.095-.275.454-1.823c-.257-.066-.517-.136-.782-.202L6.87 15l.546-1.256s.808.215.797.199c.311.077.448-.125.502-.261l.719-2.875.115.029a.864.864 0 0 0-.114-.037l.512-2.053c.013-.234-.066-.528-.511-.639.018-.011-.797-.198-.797-.198l.291-1.172 1.514.378-.001.005c.227.057.461.111.7.165l.449-1.802 1.097.273-.44 1.766c.294.067.591.135.879.207l.438-1.755 1.097.273-.449 1.802c1.384.479 2.396 1.195 2.198 2.525z"></path>
</svg>
  );

  const NGOIcon = () => (
    <svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  style={{ fill: 'rgba(255, 215, 0, 1)', transform: '', msFilter: '' }}
>
<path d="M3 14h2v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7h2a.998.998 0 0 0 .913-.593.998.998 0 0 0-.17-1.076l-9-10c-.379-.422-1.107-.422-1.486 0l-9 10A1 1 0 0 0 3 14zm5.653-2.359a2.224 2.224 0 0 1 3.125 0l.224.22.223-.22a2.225 2.225 0 0 1 3.126 0 2.13 2.13 0 0 1 0 3.07L12.002 18l-3.349-3.289a2.13 2.13 0 0 1 0-3.07z"></path></svg>
  );

  const ProofIcon = () => (
    <svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  style={{ fill: '#ffd700', transform: '', msFilter: '' }}
>
<path d="M21 11h-3V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v14c0 1.654 1.346 3 3 3h14c1.654 0 3-1.346 3-3v-6a1 1 0 0 0-1-1zM5 19a1 1 0 0 1-1-1V5h12v13c0 .351.061.688.171 1H5zm15-1a1 1 0 0 1-2 0v-5h2v5z"></path><path d="M6 7h8v2H6zm0 4h8v2H6zm5 4h3v2h-3z"></path></svg>
  );

const ApproachPage: React.FC = () => {
  return (
    <div className="approach-container">
      <div className="approach-stats">
        <div className="stat">
          <h2>1,253,643 🏘️</h2>
          <p>Total Beneficiaries</p>
        </div>
        <div className="stat">
          <h2>5,335 🎗️</h2>
          <p>Amount Donations</p>
        </div>
        <div className="stat">
          <h2>1,353 BTC 🪙</h2>
          <p>Cryptocurrency Donations Raised</p>
        </div>
      </div>
      
      <div className="approach-content">
        <div className="approach-section">
          <div className="approach-card">
            <h3>Automated Operations & Administration</h3>
            <p>Our solution leverages <strong>Smart Contracts</strong> for automated operations and administration, enabling instant, low-cost global donations. <br></br>This <strong>Streamlined approach</strong> minimizes administrative costs—ensuring that more donor money directly benefits those in need—and eliminates manual processes that can delay fund distribution.</p>
          </div>
          
          <div className="approach-card">
            <h3>Security & Compliance</h3>
            <p>Our system prioritizes security and compliance by integrating robust <strong>fraud prevention and charity organization verification measures</strong>, including comprehensive KYC identity checks. It adheres to international charity regulations while ensuring state-of-the-art cryptocurrency data security.</p>
          </div>
        </div>
        
        <div className="approach-section">
          <div className="approach-card">
            <h3>Transparency in Accountability</h3>
            <p>Leveraging <strong>tamper-proof, blockchain-based transactions</strong>, all contributions and fund usages are fully traceable and verified, while solutions implemented at each milestone—accompanied by detailed expense reports—are made publicly available.</p>
            </div>
          
          <div className="approach-card">
            <h3>Transformative Technology</h3>
            <p><strong>Fintech-driven, blockchain-based</strong> transactions to power charitable activities, enhancing the impact of charity while addressing critical challenges in the social sector of traditional charities</p>
          </div>
        </div>
        
        <div className="donate-buttons">
          <button><a href='./explore'>Donate Now</a></button>
        </div>
      </div>

      <div className="donation-flow-container">
      <div className='donation-flow-header'>
            <h1>Charity Identity Verification Flow</h1>
        </div>
      
      
      <div className="donation-flow-steps">
        <div className="donation-step">
          <div className="step-icon">
            <ProofIcon />
          </div>
          <div className="step-description">
            <h3>Charity organisation provided <strong>official documentations</strong>.</h3>
          </div>
        </div>
        
        <div className="arrow">
          <span>»</span>
        </div>
        
        <div className="donation-step">
          <div className="step-icon">
            <GovIcon />
          </div>
          <div className="step-description">
            <h3>Charity Profile verified for Official Government Registration and Legal Existence via <strong> API call</strong> to government database.</h3>
          </div>
        </div>
        
        <div className="arrow">
          <span>»</span>
        </div>
        
        <div className="donation-step">
          <div className="step-icon">
            <CheckIcon />
          </div>
          <div className="step-description">
            <h3>Further verification through comprehensive<strong> Global Know-Your-Customer (KYC) </strong> in background screening</h3>
          </div>
        </div>

        <div className="arrow">
          <span>»</span>
        </div>

        <div className="donation-step">
          <div className="step-icon">
            <MoneyIcon />
          </div>
          <div className="step-description">
            <h3>To conduct a fundraising project, charity organisation are required to submit a <strong>detailed proposal.</strong></h3>
          </div>
        </div>
      </div>

        <div className='donation-flow-header'>
            <h1>Donation Flow</h1>
            <div className="donation-flow-buttons">
                <button className="ngo-button active">
                Donor
                </button>

                <div className="arrow">
                    <span>»</span>
                </div>

                <button className="ngo-button active">
                Smart Contract Escrow
                </button>

                <div className="arrow">
                    <span>»</span>
                </div>

                <button className="ngo-button active">
                NGOs
                </button>
            </div>
        </div>
      
      
      <div className="donation-flow-steps">
        <div className="donation-step">
          <div className="step-icon">
            <DonorIcon />
          </div>
          <div className="step-description">
            <h3>Verified charity organisation submitted detailed <strong>fundraising proposal</strong>.</h3>
          </div>
        </div>
        
        <div className="arrow">
          <span>»</span>
        </div>
        
        <div className="donation-step">
          <div className="step-icon">
            <CharityIcon />
          </div>
          <div className="step-description">
            <h3>Donor makes donations via <strong>digital wallet</strong> or traditional card payments</h3>
          </div>
        </div>
        
        <div className="arrow">
          <span>»</span>
        </div>
        
        <div className="donation-step">
          <div className="step-icon">
            <LocalNGOIcon />
          </div>
          <div className="step-description">
            <h3>Funds are securely locked in a <strong> smart contract</strong> and will be automatically released once the designated milestone is achieved.</h3>
          </div>
        </div>

        <div className="arrow">
          <span>»</span>
        </div>

        <div className="donation-step">
          <div className="step-icon">
            <NGOIcon />
          </div>
          <div className="step-description">
            <h3><strong>Local NGOs</strong> utilize the grant to implement targeted solutions.</h3>
          </div>
        </div>

        <div className="arrow">
          <span>»</span>
        </div>
        
        <div className="donation-step">
          <div className="step-icon">
            <ProofIcon />
          </div>
          <div className="step-description">
            <h3><strong>Receipts, transaction details</strong>, and <strong>implementation progress</strong> are reported and publicly traceable.</h3>
          </div>
        </div>

      </div>
    </div>

    </div>
  );
};

export default ApproachPage;