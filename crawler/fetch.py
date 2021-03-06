import os
import sys
import json
import api
import logging


def list_to_dict(l, key):
    d = dict()
    for e in l:
        d[e[key]] = e
    return d


def save_json_file(root, fname, obj):
    with open(os.path.join(root, fname), 'w') as f:
        json.dump(obj, f)
    logging.debug("Fetch success:" + fname)


def work_type_category(t, lang, sem, category):
    # 學士班課程、研究所課程
    data = {}
    # 學院列表
    collages = api.get_college(
        t,
        lang,
        sem,
        category)

    for collage, collage_name in collages.items():
        data[collage_name] = {}
        logging.debug("Fetch " + collage_name)
        deps = api.get_dep(
            t,
            lang,
            sem,
            category,
            collage
        )

        for dep, dep_name in deps.items():
            data[collage_name][dep_name] = {}
            logging.debug("Fetch " + dep_name)
            grades = api.get_grade(
                t,
                lang,
                sem,
                category,
                collage,
                dep
            )
            if len(grades) == 0:
                courses = api.get_cos_list(
                    sem,
                    dep
                )
                courses = api.course_id_pipe(courses)
                data[collage_name][dep_name]['all'] = courses
            else:
                for level in grades:
                    courses = api.get_cos_list(
                        sem,
                        dep,
                        str(level)
                    )
                    courses = api.course_id_pipe(courses)
                    data[collage_name][dep_name][level] = (courses)
    return data


def work_common_class(t, lang, sem, category):
    # 學士班共同課程、學分學程、跨域學程、其他課程、教育學程
    data = {}
    deps = api.get_dep(t, lang, sem, category, '*')
    for dep, dep_name in deps.items():
        logging.debug("Fetch " + dep_name)
        courses = api.get_cos_list(sem, dep)
        courses = api.course_id_pipe(courses)
        data[dep_name] = courses
    return data


def work_all_courses_data(sem):
    data = api.get_all_cos(sem)
    data = api.course_pipe(data)
    return data


def work(sem, root):
    lang = ['zh-tw', 'en-us'][0]
    types = list_to_dict(api.get_type(), 'cname')

    save_json_file(root, 'courses.json', work_all_courses_data(sem))
    save_json_file(root, 'bachelor.json', work_type_category(types['學士班課程']['uid'], lang, sem, '3*'))
    save_json_file(root, 'graduated.json', work_type_category(types['研究所課程']['uid'], lang, sem, '2*'))
    save_json_file(root, 'common.json', work_common_class(types['學士班共同課程']['uid'], lang, sem, '0G'))
    save_json_file(root, 'program.json', work_common_class(types['學分學程']['uid'], lang, sem, '0G'))
    save_json_file(root, 'cross.json', work_common_class(types['跨領域學程']['uid'], lang, sem, '0G'))
    save_json_file(root, 'others.json', work_common_class(types['其他課程']['uid'], lang, sem, '0G'))
    save_json_file(root, 'education.json', work_common_class(types['教育學程']['uid'], lang, sem, '0G'))
