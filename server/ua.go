package main

import (
	"regexp"
	"strings"
)

var uaPatterns = []struct {
	name    string
	pattern *regexp.Regexp
}{
	{"Edge", regexp.MustCompile(`Edg[e/](\d+[\d.]*)`)},
	{"Opera", regexp.MustCompile(`(?:OPR|Opera)[/ ](\d+[\d.]*)`)},
	{"Chrome", regexp.MustCompile(`Chrome/(\d+[\d.]*)`)},
	{"Firefox", regexp.MustCompile(`Firefox/(\d+[\d.]*)`)},
	{"Safari", regexp.MustCompile(`Version/(\d+[\d.]*).*Safari`)},
	{"IE", regexp.MustCompile(`(?:MSIE |Trident/.*rv:)(\d+[\d.]*)`)},
}

var osPatterns = []struct {
	name    string
	pattern *regexp.Regexp
}{
	{"iOS", regexp.MustCompile(`(?:iPhone|iPad).*OS (\d+[._\d]*)`)},
	{"Android", regexp.MustCompile(`Android (\d+[\d.]*)`)},
	{"Windows", regexp.MustCompile(`Windows NT (\d+[\d.]*)`)},
	{"macOS", regexp.MustCompile(`Mac OS X (\d+[._\d]*)`)},
	{"Linux", regexp.MustCompile(`Linux`)},
}

var appPatterns = []struct {
	name    string
	pattern *regexp.Regexp
}{
	// China
	{"WeChat", regexp.MustCompile(`MicroMessenger/([\d.]+)`)},
	{"DingTalk", regexp.MustCompile(`DingTalk/([\d.]+)`)},
	{"Weibo", regexp.MustCompile(`Weibo/([\d.]+)`)},
	{"Douyin", regexp.MustCompile(`aweme/([\d.]+)`)},
	{"QQ", regexp.MustCompile(`QQ/([\d.]+)`)},
	{"Alipay", regexp.MustCompile(`AlipayClient/([\d.]+)`)},
	{"Baidu", regexp.MustCompile(`baiduboxapp/([\d.]+)`)},
	{"Toutiao", regexp.MustCompile(`NewsArticle/([\d.]+)`)},
	{"Xiaohongshu", regexp.MustCompile(`discover/([\d.]+)`)},
	{"Feishu", regexp.MustCompile(`Lark/([\d.]+)`)},
	// Global
	{"Facebook", regexp.MustCompile(`FBAV/([\d.]+)`)},
	{"Instagram", regexp.MustCompile(`Instagram ([\d.]+)`)},
	{"Twitter", regexp.MustCompile(`TwitterAndroid/([\d.]+)`)},
	{"LinkedIn", regexp.MustCompile(`LinkedInApp/([\d.]+)`)},
	{"Telegram", regexp.MustCompile(`Telegram/([\d.]+)`)},
	{"WhatsApp", regexp.MustCompile(`WhatsApp/([\d.]+)`)},
	{"LINE", regexp.MustCompile(`Line/([\d.]+)`)},
	{"KakaoTalk", regexp.MustCompile(`KAKAOTALK ([\d.]+)`)},
	{"Slack", regexp.MustCompile(`Slack/([\d.]+)`)},
	{"Discord", regexp.MustCompile(`Discord/([\d.]+)`)},
	{"TikTok", regexp.MustCompile(`trill/([\d.]+)`)},
	{"Snapchat", regexp.MustCompile(`Snapchat/([\d.]+)`)},
	{"Reddit", regexp.MustCompile(`Reddit/([\d.]+)`)},
	{"Pinterest", regexp.MustCompile(`Pinterest/([\d.]+)`)},
}

func parseBrowser(ua string) string {
	for _, p := range uaPatterns {
		if m := p.pattern.FindStringSubmatch(ua); len(m) > 1 {
			return p.name + " " + m[1]
		}
	}
	if strings.Contains(ua, "Safari") {
		return "Safari"
	}
	return "Unknown"
}

func parseOS(ua string) string {
	for _, p := range osPatterns {
		if m := p.pattern.FindStringSubmatch(ua); len(m) > 1 {
			ver := strings.ReplaceAll(m[1], "_", ".")
			return p.name + " " + ver
		}
		if p.pattern.MatchString(ua) && len(p.pattern.FindStringSubmatch(ua)) <= 1 {
			return p.name
		}
	}
	return "Unknown"
}

func parseDeviceType(ua string) string {
	lower := strings.ToLower(ua)
	if strings.Contains(lower, "ipad") || strings.Contains(lower, "tablet") {
		return "tablet"
	}
	if strings.Contains(lower, "mobile") || strings.Contains(lower, "iphone") || strings.Contains(lower, "android") {
		return "mobile"
	}
	return "desktop"
}

func parseApp(ua string) string {
	for _, p := range appPatterns {
		if m := p.pattern.FindStringSubmatch(ua); len(m) > 1 {
			return p.name + " " + m[1]
		}
	}
	return ""
}
