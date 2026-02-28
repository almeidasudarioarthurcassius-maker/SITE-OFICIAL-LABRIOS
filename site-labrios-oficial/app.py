import os
from flask import Flask, render_template, redirect, url_for, request, flash, jsonify, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
import cloudinary
import cloudinary.uploader
import io

app = Flask(__name__)
app.secret_key = "labrios_master_key_2026"

# CONFIGURAÇÃO CLOUDINARY
cloudinary.config(
    cloud_name = "dlwydwoz1", 
    api_key = "165575356491915", 
    api_secret = "3Dwwxqub3r-hbT2qkt2SDW0cgOI",
    secure = True
)

# BANCO DE DADOS
uri = os.environ.get('DATABASE_URL', 'sqlite:///database.db')
if uri and uri.startswith("postgres://"):
    uri = uri.replace("postgres://", "postgresql://", 1)
app.config['SQLALCHEMY_DATABASE_URI'] = uri
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# MODELOS ORIGINAIS (MANTIDOS INTEGRALMENTE)
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)

class Member(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100))
    lattes = db.Column(db.String(200))
    photo = db.Column(db.String(255))

class Equipment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    brand = db.Column(db.String(100))
    model = db.Column(db.String(100))
    purpose = db.Column(db.Text)
    image = db.Column(db.String(255))
    quantity = db.Column(db.Integer, nullable=False, default=1)
    reserves = db.relationship('Reservation', backref='equipment', cascade="all, delete-orphan", lazy=True)

class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    equipment_id = db.Column(db.Integer, db.ForeignKey('equipment.id'), nullable=False)
    date = db.Column(db.String(50), nullable=False)
    start_time = db.Column(db.String(50), nullable=False)
    end_time = db.Column(db.String(50), nullable=False)
    name = db.Column(db.String(100))
    institution = db.Column(db.String(150))
    role = db.Column(db.String(100))
    lattes = db.Column(db.String(200))
    status = db.Column(db.String(20), default='Pendente')

class Rule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)

# NOVOS MODELOS PARA OS COMITÊS (ADICIONADOS)
class GestorMember(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100))
    lattes = db.Column(db.String(200))

class UserMember(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100))
    lattes = db.Column(db.String(200))

class LabSettings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lab_name = db.Column(db.String(200), default="LABRIOS")
    hero_text = db.Column(db.Text, default="Bem-vindo ao Laboratório.")
    external_form_link = db.Column(db.String(300))
    regimento_data = db.Column(db.LargeBinary)
    regimento_filename = db.Column(db.String(255))
    # Novos campos para links de portaria
    link_portaria_gestor = db.Column(db.String(300))
    link_portaria_usuarios = db.Column(db.String(300))

# --- LOGIN E AUXILIARES (MANTIDOS) ---
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

def get_settings():
    settings = LabSettings.query.first()
    if not settings:
        settings = LabSettings()
        db.session.add(settings)
        db.session.commit()
    return settings

# --- ROTAS PÚBLICAS ---
@app.route("/")
def home():
    gestores = GestorMember.query.all()
    usuarios = UserMember.query.all()
    return render_template("index.html", settings=get_settings(), gestores=gestores, usuarios=usuarios)

@app.route("/team")
def team():
    return render_template("team.html", members=Member.query.all(), settings=get_settings())

@app.route("/how-to-use")
def how_to_use():
    return render_template("how_to_use.html", rules=Rule.query.all(), settings=get_settings())

@app.route("/download_regimento")
def download_regimento():
    s = get_settings()
    if not s.regimento_data:
        flash("Arquivo não disponível.", "warning")
        return redirect(url_for("how_to_use"))
    return send_file(io.BytesIO(s.regimento_data), mimetype='application/pdf', as_attachment=True, download_name=s.regimento_filename or "Regimento_LABRIOS.pdf")

@app.route("/equipment")
def equipment_list():
    return render_template("equipment.html", equipments=Equipment.query.all(), settings=get_settings())

@app.route("/reserve/<int:equipment_id>", methods=["GET", "POST"])
def request_reservation(equipment_id):
    equipment = Equipment.query.get_or_404(equipment_id)
    if request.method == "POST":
        new_res = Reservation(
            equipment_id=equipment_id,
            name=request.form.get("name"),
            institution=request.form.get("institution"),
            role=request.form.get("role"),
            lattes=request.form.get("lattes"),
            date=request.form.get("date"),
            start_time=request.form.get("start_time"),
            end_time=request.form.get("end_time"),
            status='Pendente'
        )
        db.session.add(new_res)
        db.session.commit()
        flash("Solicitação enviada! Aguarde a aprovação do coordenador.", "info")
        return redirect(url_for("equipment_list"))
    return render_template("reserve.html", equipment=equipment, settings=get_settings())

@app.route("/schedule")
def schedule():
    return render_template("schedule.html", settings=get_settings())

@app.route('/api/events')
def get_events():
    reserves = Reservation.query.filter_by(status='Aprovado').all()
    events = []
    for r in reserves:
        events.append({
            'title': f"OCUPADO: {r.equipment.name}",
            'start': r.date,
            'color': '#000080',
            'name': r.name,
            'institution': r.institution,
            'role': r.role
        })
    return jsonify(events)

# --- ADMINISTRAÇÃO (TODAS AS FUNÇÕES ORIGINAIS REESTABELECIDAS) ---
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        user = User.query.filter_by(username=request.form.get("user")).first()
        if user and user.password == request.form.get("password"):
            login_user(user)
            return redirect(url_for("admin_panel"))
        flash("Credenciais inválidas.", "danger")
    return render_template("login.html", settings=get_settings())

@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("home"))

@app.route("/admin")
@login_required
def admin_panel():
    return render_template("admin.html",
      settings=get_settings(),
      rules=Rule.query.all(),
      members=Member.query.all(),
      gestores=GestorMember.query.all(),
      usuarios=UserMember.query.all(),
      equipments=Equipment.query.all(),
      pending_reservations=Reservation.query.filter_by(status='Pendente').all())

@app.route("/admin/update_settings", methods=["POST"])
@login_required
def update_settings():
    s = get_settings()
    s.lab_name = request.form.get("lab_name")
    s.hero_text = request.form.get("hero_text")
    s.external_form_link = request.form.get("form_link")
    s.link_portaria_gestor = request.form.get("link_portaria_gestor")
    s.link_portaria_usuarios = request.form.get("link_portaria_usuarios")
    
    pdf = request.files.get("regimento")
    if pdf and pdf.filename != '':
        s.regimento_data = pdf.read()
        s.regimento_filename = pdf.filename
    db.session.commit()
    flash("Configurações salvas!", "success")
    return redirect(url_for("admin_panel"))

@app.route("/admin/add_committee_member", methods=["POST"])
@login_required
def add_committee_member():
    ctype = request.form.get("type")
    if ctype == "gestor":
        db.session.add(GestorMember(name=request.form.get("name"), role=request.form.get("role"), lattes=request.form.get("lattes")))
    else:
        db.session.add(UserMember(name=request.form.get("name"), role=request.form.get("role"), lattes=request.form.get("lattes")))
    db.session.commit()
    flash("Membro do comitê cadastrado!", "success")
    return redirect(url_for("admin_panel"))

@app.route("/admin/delete_committee_member/<string:ctype>/<int:id>", methods=["POST"])
@login_required
def delete_committee_member(ctype, id):
    if ctype == "gestor":
        m = GestorMember.query.get_or_404(id)
    else:
        m = UserMember.query.get_or_404(id)
    db.session.delete(m)
    db.session.commit()
    flash("Membro removido do comitê.", "info")
    return redirect(url_for("admin_panel"))

# MANTIDAS INTEGRALMENTE AS FUNÇÕES ORIGINAIS DE EQUIPAMENTOS E MEMBROS
@app.route("/admin/add_equipment", methods=["POST"])
@login_required
def add_equipment():
    f = request.files.get('image')
    img_url = None
    if f and f.filename != '':
        upload_result = cloudinary.uploader.upload(f, folder="labrios/uploads")
        img_url = upload_result['secure_url']
    db.session.add(Equipment(name=request.form.get("name"), brand=request.form.get("brand"), model=request.form.get("model"), purpose=request.form.get("purpose"), image=img_url, quantity=request.form.get("quantity", type=int)))
    db.session.commit()
    flash("Equipamento cadastrado!", "success")
    return redirect(url_for("admin_panel"))

@app.route("/admin/edit_equipment/<int:id>", methods=["POST"])
@login_required
def edit_equipment(id):
    e = Equipment.query.get_or_404(id)
    e.name = request.form.get("name")
    e.brand = request.form.get("brand")
    e.model = request.form.get("model")
    e.purpose = request.form.get("purpose")
    e.quantity = request.form.get("quantity", type=int)
    f = request.files.get('image')
    if f and f.filename != '':
        upload_result = cloudinary.uploader.upload(f, folder="labrios/uploads")
        e.image = upload_result['secure_url']
    db.session.commit()
    flash("Equipamento atualizado!", "success")
    return redirect(url_for("admin_panel"))

@app.route("/admin/delete_equipment/<int:id>", methods=["POST"])
@login_required
def delete_equipment(id):
    db.session.delete(Equipment.query.get_or_404(id))
    db.session.commit()
    return redirect(url_for("admin_panel"))

@app.route("/admin/add_member", methods=["POST"])
@login_required
def add_member():
    f = request.files.get('photo')
    img_url = None
    if f and f.filename != '':
        upload_result = cloudinary.uploader.upload(f, folder="labrios/uploads")
        img_url = upload_result['secure_url']
    db.session.add(Member(name=request.form.get("name"), role=request.form.get("role"), lattes=request.form.get("lattes"), photo=img_url))
    db.session.commit()
    return redirect(url_for("admin_panel"))

@app.route("/admin/delete_member/<int:id>", methods=["POST"])
@login_required
def delete_member(id):
    db.session.delete(Member.query.get_or_404(id))
    db.session.commit()
    return redirect(url_for("admin_panel"))

@app.route("/admin/add_rule", methods=["POST"])
@login_required
def add_rule():
    content = request.form.get("content")
    if content:
        db.session.add(Rule(content=content))
        db.session.commit()
    return redirect(url_for("admin_panel"))

@app.route("/admin/delete_rule/<int:id>", methods=["POST"])
@login_required
def delete_rule(id):
    db.session.delete(Rule.query.get_or_404(id))
    db.session.commit()
    return redirect(url_for("admin_panel"))

@app.route("/admin/approve_reservation/<int:id>", methods=["POST"])
@login_required
def approve_reservation(id):
    res = Reservation.query.get_or_404(id)
    res.status = 'Aprovado'
    db.session.commit()
    return redirect(url_for("admin_panel"))

@app.route("/admin/reject_reservation/<int:id>", methods=["POST"])
@login_required
def reject_reservation(id):
    db.session.delete(Reservation.query.get_or_404(id))
    db.session.commit()
    return redirect(url_for("admin_panel"))

@app.route("/admin/delete_regimento", methods=["POST"])
@login_required
def delete_regimento():
    s = get_settings()
    s.regimento_data = s.regimento_filename = None
    db.session.commit()
    return redirect(url_for("admin_panel"))

if __name__ == "__main__":
    app.run(debug=True)
