

import { Layout, Row, Col } from "antd";
import { HeartFilled } from "@ant-design/icons";

function Footer() {
  const { Footer: AntFooter } = Layout;

  return (
    <AntFooter style={{ background: "#fff", direction: "rtl" }}>
      <Row className="just">
        <Col xs={24} md={12} lg={12}>
          {/* <div className="copyright">
            © 1402 - ایجاد شده
            {<HeartFilled />} با
            <a href="https://www.instagram.com/arsdghi/" className="font-weight-bold" target="_blank">
              Alireza
            </a>
            .
          </div> */}
        </Col>
        <Col xs={24} md={12} lg={12}>
          {/* <div className="footer-menu">
            <ul>
              <li className="nav-item">
                <a
                  href="#pablo"
                  className="nav-link text-muted"
                  target="_blank"
                >
                  Creative Tim
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="#pablo"
                  className="nav-link text-muted"
                  target="_blank"
                >
                  About Us
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="#pablo"
                  className="nav-link text-muted"
                  target="_blank"
                >
                  Blog
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="#pablo"
                  className="nav-link pe-0 text-muted"
                  target="_blank"
                >
                  License
                </a>
              </li>
            </ul>
          </div> */}
        </Col>
      </Row>
    </AntFooter>
  );
}

export default Footer;
