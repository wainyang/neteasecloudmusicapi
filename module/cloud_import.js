// 云盘导入歌曲

module.exports = async (query, request) => {
    query.id = query.id || -2
    query.artist = query.artist || '未知'
    query.album = query.album || '未知'
    const checkData = {
      uploadType: 0,
      songs: JSON.stringify([
        {
          md5: query.md5,
          songId: query.id,
          bitrate: query.bitrate,
          fileSize: query.fileSize,
        },
      ]),
    }
    const res = await request(
      'POST',
      `https://interface3.music.163.com/eapi/cloud/upload/check/v2`,
      checkData,
      {
        crypto: 'eapi',
        cookie: query.cookie,
        proxy: query.proxy,
        realIP: query.realIP,
        url: '/api/cloud/upload/check/v2',
      },
    )
    //res.body.data[0].upload 0:文件可导入,1:文件已在云盘,2:不能导入
    //只能用song决定云盘文件名，且上传后的文件名后缀固定为mp3
    const importData = {
      uploadType: 0,
      songs: JSON.stringify([
        {
          songId: res.body.data[0].songId,
          bitrate: query.bitrate,
          song: query.song,
          artist: query.artist,
          album: query.album,
          fileName: query.song + '.' + query.fileType,
        },
      ]),
    }
    return request(
      'POST',
      `https://interface3.music.163.com/eapi/cloud/user/song/import`,
      importData,
      {
        crypto: 'eapi',
        cookie: query.cookie,
        proxy: query.proxy,
        realIP: query.realIP,
        url: '/api/cloud/user/song/import',
      },
    )
  }
  