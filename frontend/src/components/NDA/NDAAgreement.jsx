import React, { useState } from 'react';
import { Modal, Button, Checkbox, Typography } from 'antd';
const { Title, Paragraph } = Typography;

const NDA_CONTENT = `

1. "Confidential Information" means all technical, business, financial, legal, or other information disclosed by Party A to Party B, whether in written, oral, electronic, or any other form, relating to the CARE Business Plan and its exhibits, including but not limited to:
- Robotics automation technology, AI model algorithms, blockchain security architecture;
- Market analysis data, customer and partner lists;
- Financial plans, budget allocations, and funding strategies;
- Texts and interpretations of legal and regulatory provisions.
2. Exclusions. Confidential Information does not include information that:
  a. Is or becomes publicly known through no fault of Party B;
  b. Is lawfully obtained by Party B from a third party without breach of any confidentiality obligation;
  c. Is required to be disclosed by law, regulation, or order of a competent authority, provided that Party B gives Party A prompt written notice of such requirement.

2. Obligations of Confidentiality
1. Party B shall keep all Confidential Information strictly confidential and shall not disclose, reproduce, or use it for any purpose outside the scope of this Agreement without Party A's prior written consent.
2. Party B may use Confidential Information solely for the purposes of evaluating a potential business relationship, investment opportunity, or technical collaboration with Party A, as expressly authorized in writing by Party A.
3. Party B shall apply the same degree of care to protect the Confidential Information as it uses for its own confidential information, but in no event less than reasonable care, and shall ensure that its employees, agents, or affiliates comply with these obligations.

3. Term
This Agreement shall become effective on the Effective Date and shall continue in full force and effect until the date on which Party A publicly discloses the Confidential Information in its entirety.

4. Remedies and Liability
In the event of a breach or threatened breach by Party B of this Agreement, Party A shall be entitled to seek injunctive relief or other equitable remedies without the necessity of posting bond, in addition to any other remedies available at law or equity. Party B agrees to indemnify Party A for any losses, damages, costs, or expenses (including reasonable attorneys' fees) arising from such breach.

5. Governing Law and Miscellaneous
1. Governing Law: This Agreement shall be governed by and construed in accordance with the laws of the State of Texas, USA.
2. Amendments: Any amendments or modifications to this Agreement must be in writing and signed by both parties.
3. Counterparts: This Agreement may be executed in counterparts, each of which shall be deemed an original, and all of which together shall constitute one and the same instrument.

Schedule: Legal and Regulatory References
Texas State Regulations
- Texas Business & Commerce Code, Chapter 15: Protection of Trade Secrets
- Texas Health & Safety Code, Section 181: Medical Data Privacy (linked to HIPAA)
- Texas Tax Code, Section 171.1015: High-Tech Research and Development Tax Credit
Federal Regulations
- HIPAA (Health Insurance Portability and Accountability Act): Standards for Patient Data Encryption
- 21 CFR Part 11 (FDA): Electronic Records and Electronic Signatures Requirements for Laboratories
- Title 35, U.S. Code (Patent Law): Intellectual Property Protection for AI Algorithms
Compliance Measures
- Engaged Baker Botts LLP, a Texas-registered law firm, for regulatory review
- Data security system to achieve ISO 27001 certification (anticipated Q2 2025)
- Periodic technical progress reports filed with the Texas Economic Development Department
Attachments: Full Text of Referenced Laws
The following attachments contain the complete text of each referenced statute and regulation for Party B's review and record-keeping:
- Attachment A: Texas Business & Commerce Code, Chapter 15
- Attachment B: Texas Health & Safety Code, Section 181
- Attachment C: Texas Tax Code, Section 171.1015
- Attachment D: HIPAA
- Attachment E: 21 CFR Part 11
- Attachment F: Title 35, U.S. Code (Patent Law)
`;

const NDAAgreement = ({ onAgree }) => {
  const [checked, setChecked] = useState(false);

  return (
    <Modal
      open={true}
      closable={false}
      footer={null}
      width={800}
      centered
      maskClosable={false}
      style={{ top: 20 }}
      bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
    >
      <Typography>
        <Title level={3} style={{ textAlign: 'center' }}>Non-Disclosure Agreement (NDA)</Title>
        <Paragraph style={{ whiteSpace: 'pre-line', fontSize: 15 }}>{NDA_CONTENT}</Paragraph>
      </Typography>
      <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Checkbox checked={checked} onChange={e => setChecked(e.target.checked)}>
          I have read and agree to the NDA
        </Checkbox>
        <Button type="primary" disabled={!checked} onClick={onAgree}>
          Continue
        </Button>
      </div>
    </Modal>
  );
};

export default NDAAgreement;
