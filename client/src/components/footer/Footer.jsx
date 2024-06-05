import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <ul className="footer-links">
          <li><a href="/about">회사소개</a></li>
          <li><a href="/sustainability">지속가능경영</a></li>
          <li><a href="/ir">IR</a></li>
          <li><a href="/careers">채용정보</a></li>
          <li><a href="/advertising">광고/제휴/출점문의</a></li>
          <li><a href="/terms">이용약관</a></li>
          <li><a href="/standard">편성기준</a></li>
          <li><a href="/privacy">개인정보처리방침</a></li>
          <li><a href="/legal">법적고지</a></li>
          <li><a href="/email-rejection">이메일주소무단수집거부</a></li>
          <li><a href="/ethics">윤리경영</a></li>
          <li><a href="/audit">사이버감사실</a></li>
        </ul>
      </div>
      <div className="footer-bottom">
        <p>천안시 동남구 대흥로 255화일빌딩 3층 301호</p>
        <p>대표이사: 모블 </p>
        <p>호스팅사업자: 모블 개인정보보호책임자: 문희원 대표이메일: heewon@naver.com</p>
        <p>© Moble. All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
