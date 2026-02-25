import os
from app import app, db, User, LabSettings
from sqlalchemy import text

def force_init():
    with app.app_context():
        print("--- Iniciando Limpeza Forçada do PostgreSQL ---")
        tables = ['reservation', 'equipment', 'member', 'rule', 'lab_settings', 'user']
        try:
            for table in tables:
                db.session.execute(text(f'DROP TABLE IF EXISTS "{table}" CASCADE;'))
            db.session.commit()
            print("1. Tabelas antigas removidas com sucesso.")
        except Exception as e:
            print(f"Erro ao limpar tabelas: {e}")
            db.session.rollback()
            return

        db.create_all()
        print("2. Nova estrutura de tabelas criada.")

        admin = User(username="jovitoadm2026", password="lab2026rios")
        db.session.add(admin)

        settings = LabSettings(
            lab_name="LABORATÓRIO DE ANÁLISE DE ÁGUA DO MÉDIO AMAZONAS – LABRIOS/CESP",
            hero_text="Esta é a interface multiusuário oficial do laboratório, facilitando o acesso compartilhado à nossa infraestrutura tecnológica.",
            external_form_link="https://forms.google.com"
        )
        db.session.add(settings)

        try:
            db.session.commit()
            print("3. Dados iniciais e usuário jovitoadm2026 criados!")
            print("--- PROCESSO CONCLUÍDO COM SUCESSO ---")
        except Exception as e:
            print(f"Erro ao salvar dados: {e}")
            db.session.rollback()

if __name__ == "__main__":
    force_init()
