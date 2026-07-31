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
	{"Windows", regexp.MustCompile(`Windows NT (\d+[\d.]*)`)},
	{"macOS", regexp.MustCompile(`Mac OS X (\d+[._\d]*)`)},
	{"Linux", regexp.MustCompile(`Linux`)},
	{"Android", regexp.MustCompile(`Android (\d+[\d.]*)`)},
	{"iOS", regexp.MustCompile(`(?:iPhone|iPad).*OS (\d+[._\d]*)`)},
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
