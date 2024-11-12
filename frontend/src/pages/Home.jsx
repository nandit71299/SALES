import React, { useEffect } from "react";
import { data } from "../dashboardData";

function Home() {
  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex gap-5 flex-wrap">
        {data.invoices.map((invoice, index) => (
          <div className="card" key={index}>
            <div className="card-body">
              <h6 className="text-center">Invoices</h6>
              <hr />
              <div className="d-flex gap-2 justify-content-center align-items-center">
                <h6 className="m-0">{invoice.label}</h6>
                <div
                  style={{
                    height: "20px",
                    width: "1px",
                    border: "1px solid gray",
                  }}
                ></div>
                <p className="m-0">{invoice.amount}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex gap-5 flex-wrap border p-4 bg-white rounded rounded-3">
        <div className="row w-100">
          <div className="col w-100 d-flex flex-column gap-2">
            <h4>Invoices</h4>
            {data.progress
              .filter((item) => item.category === "Invoices")
              .map((item, index) => (
                <div className="flex flex-column gap-3" key={index}>
                  <p>{item.status}</p>
                  <div className="progress" style={{ width: "100%" }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                      }}
                    >
                      {item.percentage}%
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="col w-100 d-flex flex-column gap-2">
            <h4>Quotes</h4>
            {data.progress
              .filter((item) => item.category === "Quotes")
              .map((item, index) => (
                <div className="flex flex-column gap-3" key={index}>
                  <p>{item.status}</p>
                  <div className="progress" style={{ width: "100%" }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                      }}
                    >
                      {item.percentage}%
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="row gap-2">
        <div className="col p-3 bg-white rounded rounded-3">
          <h6>Recent Invoices</h6>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>No.</th>
                <th>Client</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.recent.invoices.map((invoice) => (
                <tr key={invoice.no}>
                  <td>{invoice.no}</td>
                  <td>{invoice.client}</td>
                  <td>{invoice.total}</td>
                  <td>{invoice.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col p-3 bg-white rounded rounded-3">
          <h6>Recent Quotes</h6>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Number</th>
                <th>Client</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.recent.quotes.map((quote) => (
                <tr key={quote.no}>
                  <td>{quote.no}</td>
                  <td>{quote.client}</td>
                  <td>{quote.total}</td>
                  <td>{quote.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Home;
