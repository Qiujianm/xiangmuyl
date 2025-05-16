import React, { useEffect, useState } from 'react';
import NDAAgreement from '../components/NDA/NDAAgreement';
import SignaturePage from './SignaturePage';
import TokenInputPage from './TokenInputPage';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import jsPDF from 'jspdf';

const currentDomain = window.location.hostname;
const PARTY_A = `CARE (Computerized Analysis and Reporting Enterprise)  ${currentDomain}`;

function addWatermark(doc, text, pageWidth, pageHeight) {
  doc.setFontSize(32);
  doc.setTextColor(200, 210, 240);
  doc.setFont('helvetica', 'italic');
  for (let y = 80; y < pageHeight; y += 240) {
    for (let x = -40; x < pageWidth; x += 340) {
      doc.text(text, x, y, { angle: 30 });
    }
  }
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
}

function generateNdaPdf({ name, signature }) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 50;
  const lineHeight = 20;
  const today = new Date();
  const dateStr = `${today.getFullYear()}/${String(today.getMonth()+1).padStart(2,'0')}/${String(today.getDate()).padStart(2,'0')}`;
  const centerX = pageWidth / 2;
  const partyAString = `CARE (Computerized Analysis and Reporting Enterprise) & ${window.location.hostname}`;

  // 1. 封面页
  addWatermark(doc, 'CARE Non-Disclosure Agreement', pageWidth, pageHeight);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(30, 60, 180);
  doc.text('CARE Non-Disclosure Agreement (NDA)', pageWidth/2, 180, { align: 'center' });
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Version 4.0  |  August 2024', pageWidth/2, 210, { align: 'center' });
  doc.text('Document ID: CARE-2024-BP-031', pageWidth/2, 230, { align: 'center' });
  doc.text('Confidential – Property of CARE Inc.', pageWidth/2, 250, { align: 'center' });
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(30, 60, 180);
  doc.text('This document contains proprietary information protected under U.S.\n18 U.S.C. § 1836 (Defend Trade Secrets Act) and EU Directive 2016/943.', pageWidth/2, 280, { align: 'center', maxWidth: pageWidth - 2*margin });
  doc.setTextColor(0,0,0);
  doc.setFont('helvetica', 'normal');

  // 2. 正文页（严格分行分段）
  const sections = [
    {
      title: '1. Definitions',
      lines: [
        "Confidential Information means all technical, business, financial, legal, or other information disclosed by Party A to Party B, whether in written, oral, electronic, or any other form, relating to the CARE Business Plan and its exhibits, including but not limited to:",
        "- Robotics automation technology, AI model algorithms, blockchain security architecture;",
        "- Market analysis data, customer and partner lists;",
        "- Financial plans, budget allocations, and funding strategies;",
        "- Texts and interpretations of legal and regulatory provisions.",
        "",
        "Exclusions. Confidential Information does not include information that:",
        "a. Is or becomes publicly known through no fault of Party B;",
        "b. Is lawfully obtained by Party B from a third party without breach of any confidentiality obligation;",
        "c. Is required to be disclosed by law, regulation, or order of a competent authority, provided that Party B gives Party A prompt written notice of such requirement.",
        ""
      ]
    },
    {
      title: '2. Obligations of Confidentiality',
      lines: [
        "Party B shall keep all Confidential Information strictly confidential and shall not disclose, reproduce, or use it for any purpose outside the scope of this Agreement without Party A's prior written consent.",
        "",
        "Party B may use Confidential Information solely for the purposes of evaluating a potential business relationship, investment opportunity, or technical collaboration with Party A, as expressly authorized in writing by Party A.",
        "",
        "Party B shall apply the same degree of care to protect the Confidential Information as it uses for its own confidential information, but in no event less than reasonable care, and shall ensure that its employees, agents, or affiliates comply with these obligations.",
        ""
      ]
    },
    {
      title: '3. Term',
      lines: [
        "This Agreement shall become effective on the Effective Date and shall continue in full force and effect until the date on which Party A publicly discloses the Confidential Information in its entirety.",
        ""
      ]
    },
    {
      title: '4. Remedies and Liability',
      lines: [
        "In the event of a breach or threatened breach by Party B of this Agreement, Party A shall be entitled to seek injunctive relief or other equitable remedies without the necessity of posting bond, in addition to any other remedies available at law or equity. Party B agrees to indemnify Party A for any losses, damages, costs, or expenses (including reasonable attorneys' fees) arising from such breach.",
        ""
      ]
    },
    {
      title: '5. Governing Law and Miscellaneous',
      lines: [
        "Governing Law: This Agreement shall be governed by and construed in accordance with the laws of the State of Texas, USA.",
        "Amendments: Any amendments or modifications to this Agreement must be in writing and signed by both parties.",
        "Counterparts: This Agreement may be executed in counterparts, each of which shall be deemed an original, and all of which together shall constitute one and the same instrument.",
        ""
      ]
    },
    {
      title: 'Schedule: Legal and Regulatory References',
      lines: [
        "Texas State Regulations: Texas Business & Commerce Code, Chapter 15: Protection of Trade Secrets; Texas Health & Safety Code, Section 181: Medical Data Privacy (linked to HIPAA); Texas Tax Code, Section 171.1015: High-Tech Research and Development Tax Credit.",
        "Federal Regulations: HIPAA (Health Insurance Portability and Accountability Act): Standards for Patient Data Encryption; 21 CFR Part 11 (FDA): Electronic Records and Electronic Signatures Requirements for Laboratories; Title 35, U.S. Code (Patent Law): Intellectual Property Protection for AI Algorithms.",
        "Compliance Measures: Engaged Baker Botts LLP, a Texas-registered law firm, for regulatory review; Data security system to achieve ISO 27001 certification (anticipated Q2 2025); Periodic technical progress reports filed with the Texas Economic Development Department.",
        ""
      ]
    },
    {
      title: 'Attachments: Full Text of Referenced Laws',
      lines: [
        "The following attachments contain the complete text of each referenced statute and regulation for Party B's review and record-keeping:",
        "Attachment A: Texas Business & Commerce Code, Chapter 15",
        "Attachment B: Texas Health & Safety Code, Section 181",
        "Attachment C: Texas Tax Code, Section 171.1015",
        "Attachment D: HIPAA",
        "Attachment E: 21 CFR Part 11",
        "Attachment F: Title 35, U.S. Code (Patent Law)",
        ""
      ]
    }
  ];

  // 渲染正文内容，严格分行分段
  let cursorY = margin;
  doc.addPage();
  addWatermark(doc, 'CARE Non-Disclosure Agreement', pageWidth, pageHeight);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Disclosing Party (Party A): CARE (Computerized Analysis and Reporting Enterprise)`, margin, cursorY);
  cursorY += lineHeight;
  doc.text(`Receiving Party (Party B): ${name}`, margin, cursorY);
  cursorY += lineHeight;
  doc.text(`Effective Date: ${dateStr}`, margin, cursorY);
  cursorY += lineHeight * 2;

  sections.forEach(({ title, lines }) => {
    if (cursorY > pageHeight - margin * 4) {
      doc.addPage();
      addWatermark(doc, 'CARE Non-Disclosure Agreement', pageWidth, pageHeight);
      cursorY = margin;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(30, 60, 180);
    doc.text(title, margin, cursorY);
    cursorY += lineHeight * 1.2;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    lines.forEach(line => {
      const splitLines = doc.splitTextToSize(line, pageWidth - 2 * margin);
      splitLines.forEach(subLine => {
        if (cursorY > pageHeight - margin * 4) {
          doc.addPage();
          addWatermark(doc, 'CARE Non-Disclosure Agreement', pageWidth, pageHeight);
          cursorY = margin;
        }
        if (line.startsWith('- ') || line.startsWith('a.') || line.startsWith('b.') || line.startsWith('c.')) {
          doc.text(subLine, margin + 20, cursorY);
        } else {
          doc.text(subLine, margin, cursorY);
        }
        cursorY += lineHeight * 1.1;
      });
    });
    cursorY += lineHeight * 0.7;
  });

  // 3. 签名页严格复刻
  doc.addPage();
  addWatermark(doc, 'CARE Non-Disclosure Agreement', pageWidth, pageHeight);
  let signY = pageHeight / 2 - 100;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(30, 60, 180);
  doc.text('Thank you for your trust in CARE.', centerX, signY, { align: 'center' });
  signY += lineHeight * 1.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(30, 60, 180);
  doc.text('This Agreement is executed as of the Effective Date.', centerX, signY, { align: 'center' });
  doc.setTextColor(0,0,0);
  signY += lineHeight * 2.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text('Party A (Signature):', centerX - 180, signY);
  const partyALines = doc.splitTextToSize(partyAString, 300);
  partyALines.forEach((line, idx) => {
    doc.text(line, centerX - 30, signY + idx * lineHeight * 0.9);
  });
  signY += lineHeight * (partyALines.length > 1 ? partyALines.length : 1) * 1.1;
  doc.text(`Party B (Signature):`, centerX - 180, signY);
  doc.text(name, centerX - 30, signY);
  signY += lineHeight * 1.2;
  doc.text('Date:', centerX - 180, signY);
  doc.text(dateStr, centerX - 30, signY);
  signY += lineHeight * 1.2;
  doc.text('Signature:', centerX - 180, signY);
  if (signature) {
    doc.addImage(signature, 'PNG', centerX - 30, signY - 10, 200, 60);
    signY += 70;
  } else {
    signY += 60;
  }
  // 横线和公司信息
  doc.setDrawColor(180, 180, 180);
  doc.line(margin, signY + 30, pageWidth - margin, signY + 30);
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text('www.care-domain.com', pageWidth - margin, pageHeight - 55, { align: 'right' });
  doc.text('Contact: info@care-domain.com', pageWidth - margin, pageHeight - 40, { align: 'right' });

  // 统一补充所有页码，右对齐
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Confidential – CARE Inc. | Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 20, { align: 'right' });
  }

  // 附件内容数组
  const attachments = [
    {
      title: "Attachment A: Texas Business & Commerce Code, Chapter 15",
      content: `§ 15.01. Purpose and Construction
This chapter shall be construed to accomplish its purposes, which are to maintain and promote fair competition in trade and commerce and to prevent monopolies and restraints.

§ 15.05. Contracts in Restraint of Trade
(a) Every contract, combination, or conspiracy in restraint of trade or commerce is unlawful.
(b) It is unlawful to monopolize, attempt to monopolize, or conspire to monopolize any part of trade or commerce.
(c) The provisions of this chapter shall be liberally construed to accomplish its purposes.

§ 15.10. Civil Remedies
Any person injured by a violation of this chapter may sue for damages and obtain injunctive relief.
The court may award threefold the damages sustained and the cost of the suit, including a reasonable attorney's fee.

§ 15.21. Investigation and Enforcement
The attorney general may investigate suspected violations of this chapter and may bring an action in the name of the state against any person to restrain and prevent violations.

§ 15.22. Exemptions
This chapter does not apply to activities expressly authorized by federal or state law.`
    },
    {
      title: "Attachment B: Texas Health & Safety Code, Section 181",
      content: `§ 181.001. Definitions
"Covered entity" means any person who, for commercial, financial, or professional gain, monetary fees, or dues, or on a cooperative, nonprofit, or pro bono basis, engages, in whole or in part, and with real or constructive knowledge, in the practice of assembling, collecting, analyzing, using, evaluating, storing, or transmitting protected health information.

§ 181.101. Breach of Confidentiality
A covered entity may not disclose protected health information unless authorized by law or by the individual who is the subject of the information.

§ 181.102. Training Required
Each covered entity shall provide a training program to employees regarding the state and federal law concerning protected health information.

§ 181.103. Right to Access
An individual has the right to access and obtain a copy of protected health information about the individual.

§ 181.104. Penalties
A person who violates this chapter is subject to civil penalties, including fines for each violation.`
    },
    {
      title: "Attachment C: Texas Tax Code, Section 171.1015",
      content: `§ 171.1015. Apportionment of Margin
(a) For purposes of this chapter, a taxable entity's margin is apportioned to this state to determine the amount of tax due.
(b) The margin is apportioned to the state by multiplying the taxable entity's margin by a fraction, the numerator of which is the taxable entity's gross receipts from business done in this state, and the denominator of which is the taxable entity's gross receipts from its entire business.

§ 171.1016. Reporting Requirements
A taxable entity shall file an annual report with the comptroller, stating the information required by the comptroller.

§ 171.1017. Penalties
A taxable entity that fails to file a report or pay the tax when due is liable for a penalty.

§ 171.1018. Records
A taxable entity shall keep records, books, and accounts for at least four years after the date the report is due.`
    },
    {
      title: "Attachment D: HIPAA (Health Insurance Portability and Accountability Act)",
      content: `§ 164.502. Uses and Disclosures of Protected Health Information
A covered entity may not use or disclose protected health information, except as permitted or required by this subpart or by law.

§ 164.506. Consent for Uses and Disclosures
A covered entity may obtain consent of the individual to use or disclose protected health information to carry out treatment, payment, or health care operations.

§ 164.512. Uses and Disclosures for Which an Authorization or Opportunity to Agree or Object Is Not Required
A covered entity may use or disclose protected health information without the written authorization of the individual in certain circumstances, such as for public health activities or as required by law.

§ 164.530. Administrative Requirements
A covered entity must implement policies and procedures to comply with the standards, safeguard protected health information, and train workforce members.

§ 164.534. Compliance Dates for Initial Implementation of the Privacy Rule
A covered entity must comply with the requirements of this subpart by the applicable compliance date.`
    },
    {
      title: "Attachment E: 21 CFR Part 11 (Electronic Records; Electronic Signatures)",
      content: `§ 11.10. Controls for Closed Systems
Persons who use closed systems to create, modify, maintain, or transmit electronic records shall employ procedures and controls designed to ensure the authenticity, integrity, and, when appropriate, the confidentiality of electronic records.

§ 11.30. Controls for Open Systems
Persons who use open systems to create, modify, maintain, or transmit electronic records shall employ procedures and controls to ensure the authenticity, integrity, and confidentiality of electronic records.

§ 11.50. Signature Manifestations
(a) Signed electronic records shall contain information associated with the signing that clearly indicates all of the following:
(1) The printed name of the signer;
(2) The date and time when the signature was executed;
(3) The meaning (such as review, approval, responsibility, or authorship) associated with the signature.

§ 11.100. General Requirements for Electronic Signatures
Each electronic signature shall be unique to one individual and shall not be reused or reassigned.`
    },
    {
      title: "Attachment F: Title 35, U.S. Code (Patent Law)",
      content: `§ 101. Inventions Patentable
Whoever invents or discovers any new and useful process, machine, manufacture, or composition of matter, or any new and useful improvement thereof, may obtain a patent therefor, subject to the conditions and requirements of this title.

§ 102. Conditions for Patentability; Novelty
A person shall be entitled to a patent unless—
(1) the claimed invention was patented, described in a printed publication, or in public use, on sale, or otherwise available to the public before the effective filing date of the claimed invention.

§ 103. Conditions for Patentability; Non-Obvious Subject Matter
A patent for a claimed invention may not be obtained if the differences between the claimed invention and the prior art are such that the claimed invention as a whole would have been obvious before the effective filing date of the claimed invention.

§ 112. Specification
The specification shall contain a written description of the invention, and of the manner and process of making and using it, in such full, clear, concise, and exact terms as to enable any person skilled in the art to which it pertains to make and use the same.`
    }
  ];

  // 插入六个附件，每个附件单独一页
  attachments.forEach(att => {
    doc.addPage();
    addWatermark(doc, att.title, pageWidth, pageHeight);

    // 标题自动换行
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(30, 60, 180);
    const titleLines = doc.splitTextToSize(att.title, pageWidth - margin * 1.2);
    let titleY = 55;
    titleLines.forEach(line => {
      doc.text(line, margin, titleY);
      titleY += 22; // 标题行距
    });

    // 法规出处紧跟标题后
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(`Source: Official Statute / U.S. Government / Texas Legislature`, margin, titleY + 5);

    // 正文
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(0, 0, 0);

    // 自动扩充内容（原文+补充说明）
    let content = att.content;
    content += `\n\nNote: This page contains selected excerpts of the official statute for internal reference only. For the full text, please refer to the official government website.`;

    // 自动分行，保证不超出一页
    const maxLines = Math.floor((pageHeight - (titleY + 35)) / 15); // 动态计算正文可用高度
    let lines = doc.splitTextToSize(content, pageWidth - margin * 1.2);
    if (lines.length > maxLines) {
      lines = lines.slice(0, maxLines - 1);
      lines.push('... (content truncated, see official source for full text)');
    }

    let y = titleY + 30;
    lines.forEach(line => {
      doc.text(line, margin, y);
      y += 15;
    });
  });

  doc.save('CARE_NDA.pdf');
}

function NDAFlow() {
  const [deviceId, setDeviceId] = useState('');
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [ndaAgreed, setNdaAgreed] = useState(localStorage.getItem('nda_signed') === '1');
  const [signed, setSigned] = useState(false);
  const [signatureData, setSignatureData] = useState(null);
  const [showMain, setShowMain] = useState(false);

  // 生成并存储deviceId
  useEffect(() => {
    FingerprintJS.load().then(fp => {
      fp.get().then(result => {
        setDeviceId(result.visitorId);
        localStorage.setItem('care_device_id', result.visitorId);
      });
    });
  }, []);

  // 检查本地token+deviceId
  useEffect(() => {
    if (!deviceId) return;
    const token = localStorage.getItem('care_token');
    if (token && deviceId) {
      fetch('/api/token/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: token, deviceId }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.valid) {
            setIsAuthed(true);
          } else {
            setIsAuthed(false);
            localStorage.removeItem('care_token');
          }
          setAuthChecked(true);
        });
    } else {
      setAuthChecked(true);
    }
  }, [deviceId]);

  // 1. 未校验完毕，显示加载
  if (!authChecked) return <div style={{textAlign:'center',marginTop:100}}>加载中...</div>;

  // 2. 未认证，显示Token输入页
  if (!isAuthed) {
    return <TokenInputPage onTokenValid={token => {
      localStorage.setItem('care_token', token);
      setIsAuthed(true);
    }} />;
  }

  // 3. NDA签署流程
  if (!ndaAgreed) {
    return <NDAAgreement onAgree={() => setNdaAgreed(true)} />;
  }
  if (!signed) {
    return (
      <SignaturePage
        onSubmit={data => {
          setSignatureData(data);
          setSigned(true);
          generateNdaPdf(data);
          localStorage.setItem('nda_signed', '1');
          setTimeout(() => setShowMain(true), 500);
        }}
      />
    );
  }
  if (showMain) {
    return (
      <div>
        <h1>CARE Internal Main Page</h1>
        <p>Welcome! You have successfully signed the NDA.</p>
        {/* 这里可以继续开发主站内容 */}
      </div>
    );
  }
  return null;
}

export default NDAFlow; 