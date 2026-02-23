import os
from flask import Flask, render_template, redirect, url_for, request, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.utils import secure_filename

# --- IMPLEMENTAÇÃO CLOUDINARY ---
import cloudinary
import cloudinary.uploader

cloudinary.config(
  cloud_name = "dlwydwoz1",
  api_key = os.environ.get('CLOUDINARY_API_KEY'), # Defina nas variáveis de ambiente
  api_secret = os.environ.get('CLOUDINARY_API_SECRET'), # Defina nas variáveis de ambiente
  secure = True
)
# --------------------------------

app = Flask(__name__)
# ... (restante das configurações de banco e modelos permanecem iguais)

# --- ROTAS DE ADMINISTRAÇÃO CORRIGIDAS ---

@app.route("/admin/update_settings", methods=["POST"])
@login_required
def update_settings():
    s = get_settings()
    s.lab_name = request.form.get("lab_name")
    s.hero_text = request.form.get("hero_text")
    s.external_form_link = request.form.get("form_link")
    
    pdf = request.files.get("regimento")
    if pdf and pdf.filename != '':
        # Upload de PDF como recurso bruto (raw) para o Cloudinary
        upload_result = cloudinary.uploader.upload(pdf, resource_type="raw")
        s.regimento_pdf = upload_result['secure_url']

    db.session.commit()
    flash("Configurações salvas!", "success")
    return redirect(url_for("admin_panel"))

@app.route("/admin/add_equipment", methods=["POST"])
@login_required
def add_equipment():
    f = request.files.get('image')
    image_url = None
    if f and f.filename != '':
        # Upload de imagem para o Cloudinary
        upload_result = cloudinary.uploader.upload(f)
        image_url = upload_result['secure_url']

    db.session.add(Equipment(
        name=request.form.get("name"), 
        brand=request.form.get("brand"),
        model=request.form.get("model"), 
        purpose=request.form.get("purpose"),
        image=image_url, 
        quantity=request.form.get("quantity", type=int)
    ))
    db.session.commit()
    flash("Equipamento cadastrado!", "success")
    return redirect(url_for("admin_panel"))

@app.route("/admin/add_member", methods=["POST"])
@login_required
def add_member():
    f = request.files.get('photo')
    photo_url = None
    if f and f.filename != '':
        # Upload de foto de membro para o Cloudinary
        upload_result = cloudinary.uploader.upload(f)
        photo_url = upload_result['secure_url']

    db.session.add(Member(
        name=request.form.get("name"), 
        role=request.form.get("role"),
        lattes=request.form.get("lattes"), 
        photo=photo_url
    ))
    db.session.commit()
    flash("Membro adicionado!", "success")
    return redirect(url_for("admin_panel"))
