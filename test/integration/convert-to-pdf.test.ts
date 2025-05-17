// WRITE INTEGRATION TEST
import request from "supertest";
import app from "../../main";
import { Server } from "http";

describe("POST /convert-docx-to-pdf", () => {
  let server: Server;
  beforeAll(() => {
    server = app.listen(process.env.SERVER_PORT);
  });
  // to prevent jest stuck and not closed
  afterAll(() => {
    server.close();
  });

  it("should return an error if no file is uploaded", async () => {
    const res = await request(app).post("/convert-to-pdf");
    expect(res.status).toBe(400);
    expect(res.text).toBe("Invalid file");
  });
});
