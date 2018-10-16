package com.clint.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

public class LoginInterceptor implements HandlerInterceptor {
	private List<String> exceptUrls;

	public List<String> getExceptUrls() {
		return exceptUrls;
	}

	public void setExceptUrls(List<String> exceptUrls) {
		this.exceptUrls = exceptUrls;
	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object arg2, Exception arg3)
			throws Exception {
		// TODO Auto-generated method stub

	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object arg2, ModelAndView arg3)
			throws Exception {
		// TODO Auto-generated method stub

	}

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {

		// 获取请求的URL
		String requestUri = request.getRequestURI();
		if (requestUri.startsWith(request.getContextPath())) {
			requestUri = requestUri.substring(request.getContextPath().length(), requestUri.length());
		}

		// 获取Session
		HttpSession session = request.getSession();
		String manage_username = (String) session.getAttribute("_user_manage");
		String app_username = (String) session.getAttribute("_user_app");

		if (manage_username != null && requestUri.indexOf("manage/") >= 0) {
			return true;
		}

		if (app_username != null && requestUri.indexOf("chooseRoom/") >= 0) {
			return true;
		}

		// 放行exceptUrls中配置的url
		for (String url : exceptUrls) {
			if (url.endsWith("/**")) {
				if (requestUri.startsWith(url.substring(0, url.length() - 3))) {
					return true;
				}
			} else if (requestUri.startsWith(url)) {
				return true;
			}
		}

		// URL:login.jsp是公开的;这个demo是除了login.jsp是可以公开访问的，其它的URL都进行拦截控制
		// 注意：一些静态文件不能拦截，否则会死循环，知道内存耗尽
		if (requestUri.indexOf("login") >= 0) {
			return true;
		}

		// 请求的路径
		String contextPath = request.getContextPath();
		if (requestUri.indexOf("manage/") >= 0) {
			response.sendRedirect(contextPath + "/chooselogin/index");
		} else  {
			response.sendRedirect(contextPath + "/login/index");
		}

		return false;

	}

}
