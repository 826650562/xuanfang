package com.clint.controller;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Controller
@RequestMapping(value = "/bim/bimJzxx")
public class bimController {
	@Resource
	private JdbcTemplate jdbcTemplate;
	
	
	 /**
     * 模型操作服务
     *
     */


    /**
     * setDxJdxx 向数据库插入地下设备信息
     */
    @ResponseBody
    @RequestMapping(value = "setDxJdxx", method = RequestMethod.POST)
    public String setJdxx(HttpServletRequest request, HttpServletResponse respsonse, Model model, String callback) {
        String build = request.getParameter("build");
        String dbid = request.getParameter("dbid");
        String name = request.getParameter("name");
        String type = request.getParameter("type");
        String systype = request.getParameter("systype");
        String floor = request.getParameter("floor");
        String elavation = request.getParameter("elavation");
        String xmmc = request.getParameter("xmmc");
        String id = UUID.randomUUID().toString().replace("-","");
        JSONObject obj = new JSONObject();
        if ( build != null && dbid != null && name != null && type != null) {

            int count = jdbcTemplate.queryForObject("select count(*) from T_BIM_SBLIST WHERE build='" + build + "' and dbid='" + dbid + "'", Integer.class);
            if (count > 0) {
                String del = "delete from T_BIM_SBLIST WHERE build='" + build + "' and dbid='" + dbid + "'";
                jdbcTemplate.execute(del);
            }
            try {
                /*LobHandler lobHandler = new DefaultLobHandler();  // reusable object
                JdbcTemplate.execute(
                        "INSERT INTO t_bim_qt_sblist (id,LOUDONG,dbid,type,name,others) VALUES (?, ?, ?,?,?,?)",
                        new AbstractLobCreatingPreparedStatementCallback(lobHandler) {
                            protected void setValues(PreparedStatement ps, LobCreator lobCreator) throws SQLException {
                                ps.setString(1, id);
                                ps.setString(2, build);
                                ps.setString(3, dbid);
                                ps.setString(4, type);
                                ps.setString(5, name);
                                lobCreator.setClobAsString(ps, 6, other);
                            }
                        }
                );*/
                String sql = "insert into T_BIM_SBLIST (id,build,dbid,name,type,systype,floor,elavation,xmmc) values ('"+ id +"','"+ build +"','"+ dbid +"','"+ name +"','"+ type +"','"+ systype +"','"+ floor +"','"+ elavation +"','"+ xmmc +"')";
                jdbcTemplate.execute(sql);
            } catch (Exception e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }

        }

        obj.put("success","导入成功");
        String positonStr = JSONArray.fromObject(obj).toString();
        return positonStr;
    }

    /**
     * setJDxx 向数据库插入机电系统信息
     */
    @ResponseBody
    @RequestMapping(value = "setJDxx", method = RequestMethod.POST)
    public String setJDxx(HttpServletRequest request, HttpServletResponse respsonse, Model model, String callback) {
        String loudong = request.getParameter("loudong");
        String note = request.getParameter("note");
        String typeName = request.getParameter("typeName");
        //获取楼栋号为loudong的数量
        int count = jdbcTemplate.queryForObject("select count(*) from ST_BIM_JDXT WHERE loudong='" + loudong + "' and JD_TYPE='" + typeName + "'", Integer.class);
        if (count > 0) {
            String del = "delete from ST_BIM_JDXT where  loudong='" + loudong + "' and JD_TYPE='" + typeName + "'";
            jdbcTemplate.execute(del);
        }

        String ql = "insert into ST_BIM_JDXT(loudong,JD_TYPE,JD_NOTE) values('" + loudong + "','" + typeName + "','" + note + "')  ";
        jdbcTemplate.execute(ql);
        return callback;
    }

    /**
     * setCgqxx 向数据库插入传感器
     */
    @ResponseBody
    @RequestMapping(value = "setCgqxx", method = RequestMethod.POST)
    public String setCgqxx(HttpServletRequest request, HttpServletResponse respsonse, Model model, String callback) {
        String loudong = request.getParameter("loudong");
        String CGQ_name = request.getParameter("name");
        String CGQ_num = request.getParameter("num");
        String floor = request.getParameter("floor");
        String dbid = request.getParameter("dbid");

        //获取楼栋号为loudong的数量
        int count = jdbcTemplate.queryForObject("select count(*) from T_BIM_CGQ WHERE loudong='" + loudong + "' and DBID='" + dbid + "'", Integer.class);
        if (count > 0) {
            String del = "delete from T_BIM_CGQ where  loudong='" + loudong + "' and DBID='" + dbid + "'";
            jdbcTemplate.execute(del);
        }

        String ql = "INSERT into T_BIM_CGQ(loudong,CGQ_NAME,CGQ_NUM,FLOOR,DBID) values('" + loudong + "','" + CGQ_name + "','" + CGQ_num + "','" + floor + "','" + dbid + "')  ";
        jdbcTemplate.execute(ql);
        return callback;
    }

    /**
     * getJDxt 获取楼栋机电系统列表
     */
    @ResponseBody
    @RequestMapping(value = "getJDxt")
    public String getJDxt(HttpServletRequest request, HttpServletResponse respsonse, Model model, String callback) {
        String loudong = request.getParameter("loudong");
        String excSql = "SELECT t.JD_TYPE ,t.JD_NOTE" +
                "  FROM ST_BIM_JDXT t" +
                " WHERE t.loudong = '" + loudong + "'";
        List positonList = jdbcTemplate.queryForList(excSql);
        String positonStr = JSONArray.fromObject(positonList).toString();
        return positonStr;
    }

    /**
     * setNote 修改添加楼栋机电系统标注
     */
    @ResponseBody
    @RequestMapping(value = "setNote")
    public String setNote(HttpServletRequest request, HttpServletResponse respsonse, String callback) {
        String loudong = request.getParameter("loudong");
        String type = request.getParameter("type");
        String note = request.getParameter("note");
        String excSql = "UPDATE ST_BIM_JDXT t  set t.JD_NOTE = '" + note +
                "'  WHERE t.loudong = '" + loudong +
                "' AND t.JD_TYPE = '" + type + "'";
        jdbcTemplate.execute(excSql);
        return "success";
    }

    /**
     * getCgqxx 获取传感器历史信息数据
     */
    @ResponseBody
    @RequestMapping(value = "getCgqLsxx")
    public String getCgqLsxx(HttpServletRequest request, HttpServletResponse respsonse, Model model, String callback) {
        String startTime = request.getParameter("startTime");
        String currentTime = request.getParameter("currentTime");
        //String excSql = "SELECT TO_CHAR(t.SAVEDATETIME,'HH24:mi:ss') TM ,t.TEMPERATURE ,t.HUMIDITY from ST_COLLECTVALUE t where t.SBI_SERIALNUMBER = 'S0000001' and ( t.SAVEDATETIME between to_date("+ startTime +",'yyyy-mm-dd hh24:mi:ss') and to_date("+ currentTime +",'yyyy-mm-dd hh24:mi:ss'))ORDER BY TM";
        //
        String excSql = "SELECT TO_CHAR(t.SAVEDATETIME,'HH24:mi:ss') TM ,t.TEMPERATURE ,t.HUMIDITY" +
                "  FROM ST_COLLECTVALUE t" +
                " WHERE t.sbi_serialnumber = 'S0000001'" +
                "   and t.savedatetime > to_date(" + startTime + ", 'yyyymmddhh24miss')" +
                "   and t.savedatetime < to_date(" + currentTime + ", 'yyyymmddhh24miss')" +
                "order by TM";
        List positonList = jdbcTemplate.queryForList(excSql);
        String positonStr = JSONArray.fromObject(positonList).toString();
        return callback + "(" + positonStr + ")";
    }

    /**
     * getCgqxx 获取传感器实时信息数据
     */
    @ResponseBody
    @RequestMapping(value = "getCgqxx")
    public String getCgqxx(HttpServletRequest request, HttpServletResponse respsonse, Model model, String callback) {
        String excSql = "SELECT *  FROM(SELECT TO_CHAR(t.SAVEDATETIME,'HH24:mi:ss') TM ,t.TEMPERATURE ,t.HUMIDITY  FROM  ST_COLLECTVALUE t where t.SBI_SERIALNUMBER = 'S0000001'  ORDER BY t.SAVEDATETIME DESC)  WHERE ROWNUM < 2";
        List positonList = jdbcTemplate.queryForList(excSql);
        String positonStr = JSONArray.fromObject(positonList).toString();
        return callback + "(" + positonStr + ")";
    }

    /**
     * 一鍵導入模型數據頁面  http://localhost:10080/BIM/a/bim/bimJzxx/JZImport
     */
    @RequestMapping(value = "JZImport")
    public String JZImport(HttpServletRequest request, HttpServletResponse respsonse, Model model) {
        String filePath = request.getSession().getServletContext().getRealPath("/") + "bim/svf/";
        Map dirs = this.getFiles(filePath);//获取到模型文件夹下的所有文件夹
        model.addAttribute("Dirs", dirs);
        return "pages/bim/JZImport";
    }

    /**
     * 打开查看楼栋模型页面  http://localhost:10080/BIM/a/bim/bimJzxx/toShowBuild?total=JHC-22
     */
    @RequestMapping(value = "toShowBuild")
    public String toShowBuild(HttpServletRequest request, HttpServletResponse respsonse, Model model) {
        String total = request.getParameter("total");//项目名-楼栋
        model.addAttribute("total", total);
        return "pages/showMx/toShowBuild";
    }

    /**
     * 打开查看传感器模型构件  http://localhost:10080/BIM/a/bim/bimJzxx/toShowSensor?total=JHC-22-30754
     */
    @RequestMapping(value = "toShowSensor")
    public String toShowGj(HttpServletRequest request, HttpServletResponse respsonse, Model model) {
        String total = request.getParameter("total");//项目名#楼栋#构件dbid
        model.addAttribute("total", total);
        /*String xm = request.getParameter("xm");//项目
        String ld = request.getParameter("ld");//楼栋
        String dbid = request.getParameter("dbid");//构件dbid
        model.addAttribute("dbid", dbid);
        model.addAttribute("xm", xm);
        model.addAttribute("ld", ld);*/
        return "pages/showMx/toShowSensor";
    }

    /**
     * 打开查看设备模型构件  http://localhost:10080/BIM/a/bim/bimJzxx/toShowEquipment?total=JHC-地下1层-6954
     */
    @RequestMapping(value = "toShowEquipment")
    public String toShowEquipment(HttpServletRequest request, HttpServletResponse respsonse, Model model) {
        String total = request.getParameter("total");//项目名-楼号-构件dbid
        String[] tName=total.split("-") ;
        String others;
        String excSql;
        String type;
        if(total.indexOf("地下")>=0){
            excSql  = "SELECT type  FROM T_BIM_SBLIST where  build='" + tName[1] + "' and dbid='" + tName[2] + "'";
        }else{
            excSql = "SELECT type  FROM T_BIM_SBLIST where  build='" + tName[1] + "号楼' and dbid='" + tName[2] + "'";
        }

        List positonList = jdbcTemplate.queryForList(excSql);
        if (positonList.size() > 0) {
            Map m = (Map) positonList.get(0);
            //others = String.valueOf(m.get("others"));
            type = String.valueOf(m.get("type"));
            //model.addAttribute("others", others);
            model.addAttribute("type", type);
        }
        model.addAttribute("total", total);
        return "pages/showMx/toShowEquipment";
    }

    /**
     * 打开查看楼层户模型页面  http://localhost:10080/BIM/a/bim/bimJzxx/toShowHouseHold?total=JHC-22-01-02-01
     */
    @RequestMapping(value = "toShowHouseHold")
    public String toShowHouseHold(HttpServletRequest request, HttpServletResponse respsonse, Model model) {
        String total = request.getParameter("total");//项目名-楼号-单元序号-层号-户序号
        String show = request.getParameter("show");
        String[] tName=total.split("-") ;
        int len = tName.length;
        String dbids;
        String houseType;
        if(len==5){
            String excSql = "SELECT JZ_DBIDS,JZ_HOUSETYPE  FROM T_BIM_ROOM where  loudong='" + tName[1] + "号楼' and JZ_HOUSEHOLD='" + tName[3] + tName[4] + "' and JZ_DY='" + tName[2] + "'";
            List positonList = jdbcTemplate.queryForList(excSql);
            if (positonList.size() > 0) {
                Map m = (Map) positonList.get(0);
                dbids = String.valueOf(m.get("JZ_DBIDS"));
                houseType = String.valueOf(m.get("JZ_HOUSETYPE"));

                model.addAttribute("dbids", dbids);
                model.addAttribute("houseType", houseType);
//                return dbids;
            }
        }
        model.addAttribute("show", show);
        model.addAttribute("total", total);
        return "pages/showMx/toShowHouseHold";
    }

    /**
     * 打开查看户型模型页面  http://localhost:10080/BIM/a/bim/bimJzxx/toShowHouseType?total=JHC-B2-3
     */
    @RequestMapping(value = "toShowHouseType")
    public String toShowHouseType(HttpServletRequest request, HttpServletResponse respsonse, Model model) {
        String total = request.getParameter("total");//项目名#楼号#单元序号#层号#户序号
        String show = request.getParameter("show");
        model.addAttribute("show", show);
        model.addAttribute("total", total);
        return "pages/showMx/toShowHouseType";
    }


    /**
     * setLouDong 向数据库插入建筑模型信息
     */
    @ResponseBody
    @RequestMapping(value = "setLouDong",method=RequestMethod.POST)
    public String  setLouDong(HttpServletRequest request, HttpServletResponse respsonse, String callback) {

        String loudong = request.getParameter("loudong");
        String LDBM = request.getParameter("LDBM");
        String LDH = request.getParameter("LDH");
        String LCZS = request.getParameter("LCZS");
        String CG = request.getParameter("CG");
        String LG = request.getParameter("LG");
        String DYZS = request.getParameter("DYZS");
        String xmmc = request.getParameter("xmmc");

        String uuid=UUID.randomUUID().toString();

        String xmmcId=getXMBH(xmmc);

        //获取楼栋号为loudong的数量
        int count = jdbcTemplate.queryForObject("select count(*) from T_BIM_LDXX WHERE LDMC='"+ loudong +"'",Integer.class);
        if(count>0){
            String del = "delete from T_BIM_LDXX where  LDMC='"+ loudong +"'";
            jdbcTemplate.execute(del);
        }
        String sql = "INSERT into T_BIM_LDXX(id,LDMC,LDBM,LDH,LCZS,CG,LG,XMMC,DYZS) values('"+uuid+"','"+loudong+"','"+LDBM+"','"+LDH+"','"+LCZS+"','"+CG+"','"+LG+"','"+xmmcId+"','"+DYZS+"')  ";
        jdbcTemplate.execute(sql);

        return callback;
    }




    /**
     * 模型管理页面打开查看模型页面
     */
    @RequestMapping(value = "mxShow")
    public String mxShow(HttpServletRequest request, HttpServletResponse respsonse, Model model) {
        String name = request.getParameter("name");
        model.addAttribute("name", name);
        return "pages/bim/mxShow";
    }

    /**
     * setFloor 向数据库插入建筑模型楼层信息
     */
    @ResponseBody
    @RequestMapping(value = "setFloor", method = RequestMethod.POST)
    public String setFloor(HttpServletRequest request, HttpServletResponse respsonse, String callback) {
        String loudong = request.getParameter("loudong");
        String floor = request.getParameter("floor");
        String dbid = request.getParameter("dbid");
//		String[] dbids=dbid.split(",");
//		String[] floors=floor.split(",");
//		StringBuffer sql=new StringBuffer("insert ALL ");
//
//		for(int i=0;i<=dbids.length-1;i++){
//			sql.append("into T_BIM_FLOOR(loudong,JZ_DBID,JZ_FLOOR) values('"+loudong+"','"+dbids[i]+"','"+floors[i]+"')  ");
//		}
//
//		sql.append("  select 1 from dual ");

        String sql = "INSERT into T_BIM_FLOOR(loudong,JZ_DBID,JZ_FLOOR) values('" + loudong + "','" + dbid + "','" + floor + "')  ";

        //获取楼栋号为loudong的数量
        int count = jdbcTemplate.queryForObject("select count(*) from T_BIM_FLOOR WHERE loudong='" + loudong + "' and JZ_FLOOR='" + floor + "'", Integer.class);

        if (count > 0) {
            String del = "delete from T_BIM_FLOOR where  loudong='" + loudong + "' and JZ_FLOOR='" + floor + "'";
            jdbcTemplate.execute(del);
        }
        jdbcTemplate.execute(sql);
        return callback;
    }

    /**
     * setRoom 向数据库插入建筑模型楼层信息
     */
    @ResponseBody
    @RequestMapping(value = "setRoom", method = RequestMethod.POST)
    public String setRoom(HttpServletRequest request, HttpServletResponse respsonse, String callback) {
        String loudong = request.getParameter("loudong");
        String room = request.getParameter("room");
        String dbids = request.getParameter("dbids");
        String type = request.getParameter("type");
        String dy = request.getParameter("dy");
        String floor = request.getParameter("floor");
        String xmmc = request.getParameter("xmmc");//wxl  项目名称

        String uuid = UUID.randomUUID().toString();
        String xmmcId=getXMBH(xmmc);

        //获取楼栋号为loudong的数量
        int count = jdbcTemplate.queryForObject("select count(*) from T_BIM_ROOM WHERE loudong='"+ loudong +"' and JZ_HOUSEHOLD='"+ room +"'",Integer.class);
        if(count>0){
            String del = "delete from T_BIM_ROOM where  loudong='"+ loudong +"' and JZ_HOUSEHOLD='"+ room +"'";
            jdbcTemplate.execute(del);
        }
        String sql = "INSERT into T_BIM_ROOM(id,loudong,JZ_DBIDS,JZ_FLOOR,JZ_HOUSETYPE,JZ_HOUSEHOLD,JZ_DY,XMMC) values('"+uuid+"','"+loudong+"','"+dbids+"','"+floor+"','"+type+"','"+room+"','"+dy+"','"+xmmcId+"')  ";
        jdbcTemplate.execute(sql);

        return callback;
    }

    //获取项目名称  参数 中文名称   返回  项目编号
    public String getXMBH(String xmmc){

        String getXmmcSQL="select id from T_BIM_XMGL where XMMC='"+xmmc+"'";

        Map getXmmc =jdbcTemplate.queryForMap(getXmmcSQL);
        String xmmcId=String.valueOf(getXmmc.get("id"));

        return xmmcId;
    }


    /**
     * 删除文件夹
     */
    @ResponseBody
    @RequestMapping(value = "delete", method = RequestMethod.POST)
    public String delete(HttpServletRequest request, HttpServletResponse respsonse, String callback) throws Exception {//@RequestParam("file") MultipartFile file
        /*String fileName = file.getOriginalFilename();


		String getName = fileName.substring(0,fileName.indexOf("."));*/
        JSONObject rtns = new JSONObject();
        String getName = request.getParameter("name");
        String files = request.getSession().getServletContext().getRealPath("/") + "svf/" + getName;
        File fileBox = new File(files);
        if (!fileBox.exists()) {
            rtns.put("has", "删除文件失败：" + getName + "文件夹不存在");
        } else {
			/*if (fileBox.isFile()){
				deleteFile(files);//删除文件

			}else{
				deleteDirectory(files);
			}*/
            deleteDirectory(files);
            //zipUpload(request,file);//调用上传方法
            String filePath = request.getSession().getServletContext().getRealPath("/") + "svf/";
            Map dirs = this.getFiles(filePath);//获取到模型文件夹下的所有文件夹
            rtns.put("success", "删除成功");
            rtns.put("dirs", dirs);
            //rtns.put("fileName",getName);
        }

        return JSONArray.fromObject(rtns).toString();
    }

    /**
     * 删除单个文件
     */
    public static boolean deleteFile(String fileName) {
        File file = new File(fileName);
        // 如果文件路径所对应的文件存在，并且是一个文件，则直接删除
        if (file.exists() && file.isFile()) {
            if (file.delete()) {
                System.out.println("删除单个文件" + fileName + "成功！");
                return true;
            } else {
                System.out.println("删除单个文件" + fileName + "失败！");
                return false;
            }
        } else {
            System.out.println("删除单个文件失败：" + fileName + "不存在！");
            return false;
        }
    }

    /**
     * 删除目录及目录下的文件
     */
    public static boolean deleteDirectory(String dir) {
        // 如果dir不以文件分隔符结尾，自动添加文件分隔符
        if (!dir.endsWith(File.separator))
            dir = dir + File.separator;
        File dirFile = new File(dir);
        // 如果dir对应的文件不存在，或者不是一个目录，则退出
        if ((!dirFile.exists()) || (!dirFile.isDirectory())) {
            System.out.println("删除目录失败：" + dir + "不存在！");
            return false;
        }
        boolean flag = true;
        // 删除文件夹中的所有文件包括子目录
        File[] files = dirFile.listFiles();
        for (int i = 0; i < files.length; i++) {
            // 删除子文件
            if (files[i].isFile()) {
                flag = deleteFile(files[i].getAbsolutePath());
                if (!flag)
                    break;
            }
            // 删除子目录
            else if (files[i].isDirectory()) {
                flag = deleteDirectory(files[i]
                        .getAbsolutePath());
                if (!flag)
                    break;
            }
        }
        if (!flag) {
            System.out.println("删除目录失败！");
            return false;
        }
        // 删除当前目录
        if (dirFile.delete()) {
            System.out.println("删除目录" + dir + "成功！");
            return true;
        } else {
            return false;
        }
    }

    /*
     * 获取文件夹下的所有文件或者文件夹名称
     * */

    public static Map getFiles(String path) {
        File file = new File(path);
        File[] tempList = file.listFiles();
        ArrayList res = new ArrayList();
        Map resMap = new HashMap();
        for (int i = 0; i < tempList.length; i++) {
            if (tempList[i].isDirectory()) {
                Date date = new Date(tempList[i].lastModified());
                String[] dirName = tempList[i].toString().split("\\\\");
                String fileName = dirName[dirName.length - 1];
                resMap.put(fileName, date.toLocaleString());
            }
        }
        return resMap;
    }

    /**
     * 修改文件名字
     *
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "updateFileName", method = RequestMethod.POST)
    public String updateFileName(HttpServletRequest request, HttpServletResponse respsonse) {
        String oldName = request.getParameter("oldName");
        String newName = request.getParameter("newName");
        String filePath = request.getSession().getServletContext().getRealPath("/") + "svf/";
        File f = new File(filePath + oldName);
        File newf = new File(filePath + newName);
        JSONObject rtns = new JSONObject();
        if (f.renameTo(newf)) {
            rtns.put("update", "文件名更新成功！");
        } else {
            rtns.put("update", "文件名更新失败！");
        }
        return JSONArray.fromObject(rtns).toString();
    }


    /**
     * 上传压缩文件
     */
    @ResponseBody
    @RequestMapping(value = "zipUpload", method = RequestMethod.POST)
    public String zipUpload(HttpServletRequest request, @RequestParam("file") MultipartFile file) throws Exception {

        JSONObject rtn = new JSONObject();
        // 判断文件是否为空
        if (!file.isEmpty()) {
            String fileName = file.getOriginalFilename();//文件名包括后缀
            int pos = fileName.lastIndexOf(".");
            String extName = fileName.substring(pos + 1).toLowerCase();
            String getName = fileName.substring(0, fileName.indexOf("."));
            //判断上传文件必须是zip或者是rar否则不允许上传
            if (!extName.equals("zip")) {
                rtn.put("error", "文件类型错误，请重新选择");
            } else {
                try {
                    // 文件保存路径
                    String filePath = request.getSession().getServletContext().getRealPath("/") + "svf/";
                    String fillFilePath = filePath + fileName;
                    //解压文件夹路径
                    String fileCon = request.getSession().getServletContext().getRealPath("/") + "svf/";
                    File fileOld = new File(fillFilePath.substring(0, fillFilePath.indexOf(".")));
                    if (fileOld.exists()) {
                        rtn.put("has", "该模型已存在");
                    } else {
                        // 转存文件
                        file.transferTo(new File(fillFilePath));
                        //解压文件
                        unZipFiles(new File(fillFilePath), fileCon);

                        Map dirs = this.getFiles(filePath);//获取到模型文件夹下的所有文件夹
                        rtn.put("success", "上传文件成功");
                        rtn.put("fileName", getName);
                        rtn.put("dirs", dirs);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

        }
        return JSONArray.fromObject(rtn).toString();
    }


    /**
     * /zip解压
     */

    public static void unZipFiles(File zipFile, String descDir) throws Exception {
        ZipFile zip = new ZipFile(zipFile, Charset.forName("GBK"));//解决中文文件夹乱码
        String name = zip.getName().substring(zip.getName().lastIndexOf('\\') + 1, zip.getName().lastIndexOf('.'));

        File pathFile = new File(descDir + name);
        if (!pathFile.exists()) {
            pathFile.mkdirs();
        }

        for (Enumeration<? extends ZipEntry> entries = zip.entries(); entries.hasMoreElements(); ) {
            ZipEntry entry = (ZipEntry) entries.nextElement();
            String zipEntryName = entry.getName();
            InputStream in = zip.getInputStream(entry);
            String outPath = (descDir + name + "/" + zipEntryName).replaceAll("\\*", "/");

            // 判断路径是否存在,不存在则创建文件路径
            File file = new File(outPath.substring(0, outPath.lastIndexOf('/')));
            if (!file.exists()) {
                file.mkdirs();

            }
            // 判断文件全路径是否为文件夹,如果是上面已经上传,不需要解压
            if (new File(outPath).isDirectory()) {
                continue;
            }
            FileOutputStream out = new FileOutputStream(outPath);
            byte[] buf1 = new byte[1024];
            int len;
            while ((len = in.read(buf1)) > 0) {
                out.write(buf1, 0, len);
            }
            in.close();
            out.close();

        }
        zip.close();
        zipFile.delete();//删除压缩包
    }
    
    
    

    /**
     * 电梯模型系统页面设置 http://localhost:18080/BIM/a/bim/bimJzxx/Videolist 教学视频
     */
    @RequestMapping(value = "Videolist")
    public String Videolist(HttpServletRequest request, HttpServletResponse respsonse) {
        return "pages/lift/videolist";
    }

    /**
     * 电梯模型系统页面设置 http://localhost:18080/BIM/a/bim/bimJzxx/Pdfydq pdf阅读器
     */
    @RequestMapping(value = "Pdfydq")
    public String Pdfydq(HttpServletRequest request, HttpServletResponse respsonse) {
        return "pages/lift/pdfydq";
    }

    /**
     * 电梯模型系统页面设置 http://localhost:18080/BIM/a/bim/bimJzxx/Pdflist 检修记录
     */
    @RequestMapping(value = "Pdflist")
    public String Pdflist(HttpServletRequest request, HttpServletResponse respsonse) {
        return "pages/lift/pdflist";
    }

    /**
     * 传感器列表显示 http://localhost:18080/BIM/a/bim/bimJzxx/Cgqlist 传感器列表
     */
    @RequestMapping(value = "Cgqlist")
    public String Cgqlist(HttpServletRequest request, HttpServletResponse respsonse) {
        return "pages/lift/cgqlist";
    }


}
