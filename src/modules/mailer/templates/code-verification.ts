export const codeVerificationTemplate = (code: string) => {
    return `
    <div style="font-family: Arial;">
        <div style="background-color: #060606;
        padding: 35px 50px;
        max-width: 600px;
        width: 100%;
        text-align: center;">
        <div style="color: white;
        font-size: 48px;
        margin-top: 16px;
        font-weight: 900">BUMP</div>
        <div style="color: gray;
        font-size: 18px;
        margin-top: 12px;
        font-weight: 100;">для завершения входа
            <br>введите проверочный код:</div>
        <div style="color: white;
        letter-spacing: 20px;
        font-weight: 900;
        font-size: 48px;
        margin-top: 24px;
        padding: 10px 0px 10px 20px;">${code}</div>
        </div>
        <div style="width: 100%;
        height: 1px;
        background-color: white"></div>
        <div style="background-color: #060606;
        padding: 35px 50px;
        max-width: 600px;
        width: 100%;
        text-align: center;">
        <div style="color: white;
        line-height: 24px;
        font-size: 18px;">С уважением,
            <br>BUMP FAMILY</div>
        </div>
  </div>
    `;
};
