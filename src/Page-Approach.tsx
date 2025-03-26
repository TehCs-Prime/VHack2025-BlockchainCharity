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
  
  const CharityIcon = () => (
    <svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  style={{ fill: 'rgba(255, 215, 0, 1)', transform: '', msFilter: '' }}
>
<path d="M17.726 13.02 14 16H9v-1h4.065a.5.5 0 0 0 .416-.777l-.888-1.332A1.995 1.995 0 0 0 10.93 12H3a1 1 0 0 0-1 1v6a2 2 0 0 0 2 2h9.639a3 3 0 0 0 2.258-1.024L22 13l-1.452-.484a2.998 2.998 0 0 0-2.822.504zm1.532-5.63c.451-.465.73-1.108.73-1.818s-.279-1.353-.73-1.818A2.447 2.447 0 0 0 17.494 3S16.25 2.997 15 4.286C13.75 2.997 12.506 3 12.506 3a2.45 2.45 0 0 0-1.764.753c-.451.466-.73 1.108-.73 1.818s.279 1.354.73 1.818L15 12l4.258-4.61z"></path></svg>
  );
  
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

      <div className='intro-container'>
      <div className='approach-intro-img'>
        <img src='/assets/LoveHand-removebg-preview.png'></img>
      </div>

        <div className='intro-words'>
          <div className='intro-title'>"Trace, Trust, Transform"</div>
          <div className='intro-des'>We as <strong>LaCial Charity</strong>, are forging a robust and trusted network of partners that bridges global solutions with local challenges, collaborating with leading international organizations as well as grassroots nonprofits.</div>
        </div>

      </div>

      <div className="donation-flow-container">
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
                LaCial Charity
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