import { useEffect, useState } from "react";

import { Card, Col, Row, Spin, message } from "antd";
import CheckAuth from "../CheckAuth";
import { controller } from "../assets/controller/controller";

import SellChart from "../components/chart/SellChart";
import SellBuy from "../components/chart/SellBuy";

function Home() {
  const [count, setCount] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  // const { Title, Text } = Typography;

  const readDashboardSummury = async () => {
    setLoading(true);
    try {
      const response = await controller.getDashboardSummary();

      const resPrice = await controller.getPriceList(0);
      console.log(resPrice);
      setCount(resPrice.json);
      setSummary(response.json);
      console.log(response);
    } catch (e) {
      message.error("خطا در ارتباط با سرور");
    }
    setLoading(false);

    setLoading(false);
  };

  // useEffect(() => {
  //   window.najvaUserSubscribed = function (najva_user_token) {
  //     console.log("res")
  //     console.log(najva_user_token)
  //     // you have user specific najva_user_token, add your logic here
  //   }
  // }, [])

  useEffect(() => {
    readDashboardSummury();
  }, []);

  return loading ? (
    <Row justify="center">
      <Spin />
    </Row>
  ) : (
    <>
      <div className="layout-content">
        <Card title="داشبورد">
          <Card style={{ marginBottom: "15px" }}>
            <Row
              className="rowgap-vbox"
              justify="space-between"
              gutter={[2, 2]}
            >
              {count.map((c, index) => (
                <Col
                  xs={4} // Full width on all screen sizes
                  key={index}
                  style={{
                    border: "1px solid #eee",
                    paddingTop: "20px",
                    paddingRight: "20px",
                    paddingBottom: "20px",
                    paddingLeft: "20px",
                    borderRadius: "8px",
                  }}
                  className="mb-24"
                >
                  <span>{c.label}</span>
                  <br />
                  <Row justify="space-between" style={{ marginTop: "12px" }}>
                    <Col>
                      <div style={{ display: "flex", color: "#4cc74c" }}>
                        خرید
                        <div style={{ display: "flex", marginRight: "5px" }}>
                          {c.buy_fee}
                        </div>
                      </div>
                      <div style={{ display: "flex", color: "red" }}>
                        فروش
                        <div style={{ display: "flex", marginRight: "5px" }}>
                          {c.sell_fee}
                        </div>
                      </div>
                    </Col>
                    <br />

                    {/* <Col>
                          <div style={{ display: "flex" }}>
                            اختلاف هزینه خرید و فروش
                            <div
                              style={{ display: "flex", marginRight: "10px" }}
                            >
                              {summary &&
                              summary[c.item] &&
                              summary[c.item].fee &&
                              !isNaN(summary[c.item].fee.replace(/,/g, "")) ? (
                                eval(summary[c.item].fee.replace(/,/g, "")) <
                                0 ? (
                                  <div
                                    style={{
                                      display: "flex",
                                      color: "red",
                                      direction: "ltr",
                                    }}
                                  >
                                    {" "}
                                    {summary[c.item].fee}{" "}
                                  </div>
                                ) : (
                                  <div
                                    style={{
                                      display: "flex",
                                      color: "#4cc74c",
                                    }}
                                  >
                                    {summary[c.item].fee}
                                  </div>
                                )
                              ) : (
                                "-"
                              )}
                            </div>
                          </div>
                          <div style={{ display: "flex" }}>
                            {c.unit == "count"
                              ? "اختلاف تعداد خرید و فروش"
                              : "اختلاف وزن خرید فروش (گرم)"}
                            <div
                              style={{ display: "flex", marginRight: "10px" }}
                            >
                              {summary &&
                              summary[c.item] &&
                              summary[c.item].unit ? (
                                eval(summary[c.item].unit.replace(/,/g, "")) <
                                0 ? (
                                  <div
                                    style={{
                                      display: "flex",
                                      color: "red",
                                      direction: "ltr",
                                    }}
                                  >
                                    {" "}
                                    {summary[c.item].unit}{" "}
                                  </div>
                                ) : (
                                  <div
                                    style={{
                                      display: "flex",
                                      color: "#4cc74c",
                                    }}
                                  >
                                    {summary[c.item].unit}
                                  </div>
                                )
                              ) : (
                                "-"
                              )}
                            </div>
                          </div>
                        </Col> */}
                  </Row>
                </Col>
              ))}
            </Row>
          </Card>
          <Row gutter={[10, 10]}>
            <Col sm={24} >
              <Card style={{ height: "100%" }} title="آمار فروش">
                <SellChart />
              </Card>
            </Col>
            <Col sm={24}>
              <Card title="نسبت خرید و فروش">
                <SellBuy />
              </Card>
            </Col>
          </Row>
        </Card>

        {/* <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <Echart />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={14} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <LineChart />
            </Card>
          </Col>
        </Row> */}
      </div>
      <CheckAuth />
    </>
  );
}

export default Home;
