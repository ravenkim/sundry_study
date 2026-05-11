from flask import Flask, render_template, request, redirect, send_file
from croller import extract_color
from file import save_to_file


# 웹아 아닌 파일로 보여줄때
# colors = extract_color(keyword)
# save_to_file(keyword, colors)

app = Flask("ColorScrapper")

db = {}


@app.route("/")
def home():
    return render_template("home.html")


@app.route("/search")
def search():
    keyword = request.args.get("keyword")
    if keyword == None:
        return redirect("/")
    if keyword in db:
        colors = db[keyword]
    else:
        colors = extract_color(keyword)
        db[keyword] = colors
    return render_template("search.html", keyword=keyword, colors=colors)


@app.route("/export")
def export():
    keyword = request.args.get("keyword")
    if keyword == None:
        return redirect("/")
    if keyword not in db:
        return redirect(f"/search?keyword={keyword}")
    save_to_file(keyword, db[keyword])
    return send_file(f"{keyword}.csv", as_attachment=True)


app.run("127.0.0.1")
