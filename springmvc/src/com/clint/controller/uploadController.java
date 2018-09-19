package com.clint.controller;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.hibernate.validator.util.privilegedactions.GetConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.MultipartRequest;

import net.sf.json.JSONObject;

/**
 *  * 文件上传测试类  
 */
@Controller
@RequestMapping("/upload")
public class uploadController {
	
	@RequestMapping(value = "/index")
	public String testUpload(){
		return "upload/test";
	}
	
	@RequestMapping(value = "/toUpload", method = RequestMethod.POST)
	public void toUpload(HttpServletRequest request,HttpServletResponse response,MultipartHttpServletRequest muReq) throws IOException, FileUploadException {
		String path = request.getSession().getServletContext().getRealPath("/");//项目的根目录
		File dest = new File(path + "/" +"/images"+"/uploadImg");//存放图片的文件夹
	    String endPath =  path +"/images"+"/uploadImg";//文件存放文件夹路径
		MultiValueMap<String,MultipartFile> map = muReq.getMultiFileMap();// 为了获取文件，这个类是必须的 
	    List<MultipartFile> list = map.get("file");// 获取到文件的列表 
	    List<String>filenameList= new ArrayList<String>();// 新建一个ArrayList	    	    
		JSONObject obj = new JSONObject();
	    if (!dest.exists()) { // 判断文件父目录是否存在
	    	dest.mkdir();
        }else{
        	// 将图片进行存储 
    		for (MultipartFile mFile : list) { 
    		    String originalFileName= mFile.getOriginalFilename();//获取文件名称 
    			filenameList.add(originalFileName);
    			byte[] bytes = mFile.getBytes();//获取字节数组 
    			String filePath= endPath + File.separator+ originalFileName;//单个文件存放路径
    			FileOutputStream fos= new FileOutputStream(new File(filePath)); //写出到文件 
    		    fos.write(bytes); 
    		    fos.flush(); 
    		    fos.close(); 
    		}   
    		if(filenameList.size()==list.size()){
    			obj.put("success", "上传成功！");
    			obj.put("filenameList", filenameList);
    		}
        }
		response.getWriter().write(String.valueOf(obj));
	}
}
