const Koa = require('koa')
const axios = require('axios');
const KoaRouter = require('koa-router')
const json = require('koa-json')
const {genPDF, genWktPDF} = require('./poolUtils')
const fs = require('fs')
const {aesDecrypt, uploadPDFToQiNiuOSS} = require("./tools");

const app = new Koa();
const router = new KoaRouter()

const isDev = process.env.NODE_ENV === 'development'
const clientHost = isDev
  ? 'http://localhost:8000'
  : process.env.CLIENT_HOST_PROD || 'https://www.example.com'
const cdnHost = process.env.CDN_HOST || 'https://static.example.com'
const pdfPrefix = process.env.PDF_PREFIX || 'resume'


router.get('/file-api/dps/create-pdf', async (ctx) => {
  const {fileName, token, url} = ctx.request.query
  console.log(new Date(), fileName, token, url,)
  if (!fileName || !token || !url) {
    ctx.body = {
      code: 0,
      data: '',
      message: 'fileName,token,url都不可为空'
    }
    return
  }
  const pdf = await genPDF({
    url,
    token,
    waitTime: 0
  }).catch(() => {
    ctx.body = {
      code: 0,
      data: '',
      message: '未知异常，请重试'
    }
  })
  try {
    let newFileName = encodeURIComponent(fileName, "GBK")
    newFileName = newFileName.toString('iso8859-1')
    ctx.set({'Content-Type': 'application/pdf;charset=utf-8'})
    ctx.set('Content-disposition', `attachment;filename=${newFileName}.pdf`);
    ctx.body = pdf
  } catch {
    ctx.body = {
      code: 0,
      data: '',
      message: '未知异常，请重试'
    }
  }
})
router.get('/resume-api/puppeteer/pdf', async (ctx) => {
  const { authCode } = ctx.request.query
  console.time('timer')
  console.log('1.开始渲染')
  const config = JSON.parse(aesDecrypt(decodeURIComponent(authCode)))
  const url = `${clientHost}/preview/${config.resumeId}?print=1`
  const resumeId = config.resumeId
  const pdf = await genWktPDF({
    url,
    token: config.token,
    margin: config.margin,
    waitTime: 10
  }).catch(() => {
    ctx.body = {code: 0, data: '', message: '未知异常，请重试'}
  })
  console.timeEnd('timer')
  console.log('2.渲染结束')
  ctx.body = pdf
})

router.get('/resume-api/puppeteer/pdf-new', async (ctx) => {
  const { authCode } = ctx.request.query
  console.time('timer')
  console.log('1.开始渲染')
  const config = JSON.parse(aesDecrypt(decodeURIComponent(authCode)))
  const url = `${clientHost}/preview/${config.resumeId}?print=1`
  const resumeId = config.resumeId
  const filePath = await genWktPDF({
    url,
    token: config.token,
    margin: config.margin,
    waitTime: 10
  }, resumeId).catch(() => {
    ctx.body = {code: 0, data: '', message: '未知异常，请重试'}
  })
  console.timeEnd('timer')
  console.log('2.渲染结束')
  console.log('3.开始上传')
  console.time('upload')
  const fileName = `${pdfPrefix}${resumeId}.pdf`
  await uploadPDFToQiNiuOSS(filePath, fileName, "简历中文名.pdf").catch(err => {
    ctx.body = {code: 0, data: '', message: '未知异常，请重试'}
  })
  console.timeEnd('upload')
  console.log('4.上传结束')
  fs.unlink(filePath, () => {})
  const pdfPath = `${cdnHost}/resume-pdf/${fileName}`
  console.log(`访问地址：${pdfPath}`)
  ctx.body = {
    code: 0,
    data: pdfPath,
    message: 'success',
    success: true
  }
})

app.use(json())
app.use(router.routes())

app.listen(8090, () => {
  console.log('listen: 8090...')
})
