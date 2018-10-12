package com.clint.service.impl;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import com.clint.service.HomeService;
import com.clint.service.MapService;

@Service(value = "homeService")
public class HomeServiceImpl implements HomeService {

	@Resource
	private MapService mapService;

	@Override

	public List confirmInfo(String username,String psw) {
		// TODO Auto-generated method stub
		String loginsql = "select * from T_BIM_CHOOSEROOM_LOGIN t where t.LOGINNAME = '"+username+"' and t.PASSWORD = '"+psw+"'";
		List res = this.mapService.getListBySql(loginsql);
		return res;
	}
		

}

