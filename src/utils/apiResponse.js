class apiResponse {
  constructor(statusCode, message = "success", data) {
    this.statusCode=statusCode;
    this.message=message;
    this.data=data;
  }
}

export default apiResponse;
