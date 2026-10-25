import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateProjectDto } from './create-project.dto';
import { UpdateProjectDto } from './update-project.dto';

const base = {
  nameAr: 'مشروع',
  nameEn: 'Project',
  shortDescriptionAr: 'وصف',
  shortDescriptionEn: 'Short',
  isActive: true,
  categoryProjectsIds: [1],
};

// Mirrors the global ValidationPipe: transform, then validate.
async function parse<T extends object>(cls: new () => T, body: object) {
  const dto = plainToInstance(cls, body, { enableImplicitConversion: true });
  return { dto, errors: await validate(dto, { whitelist: true, forbidNonWhitelisted: true }) };
}

describe('CreateProjectDto rich-text descriptions', () => {
  it('stores the editor HTML without scripts, handlers, iframes or attributes', async () => {
    const { dto, errors } = await parse(CreateProjectDto, {
      ...base,
      descriptionEn:
        '<p class="x" id="y" style="color:red" onclick="alert(1)">Hi <strong>there</strong></p>' +
        '<script>alert(1)</script><iframe src="https://evil"></iframe><img src=x onerror=alert(1)>' +
        '<p><a href="javascript:alert(1)">bad</a> <a href="https://ok.example" target="_self">ok</a></p>',
      descriptionAr: '<p>مرحبا</p>',
    });
    expect(errors).toHaveLength(0);
    expect(dto.descriptionEn).toBe(
      '<p>Hi <strong>there</strong></p>' +
        '<p>bad <a href="https://ok.example" target="_blank" rel="noopener noreferrer nofollow">ok</a></p>',
    );
    expect(dto.descriptionAr).toBe('<p>مرحبا</p>');
  });

  it.each(['<p></p>', '<p><br></p>', '<script>alert(1)</script>', '<iframe>x</iframe>', '   '])(
    'rejects a description with nothing visible: %s',
    async (value) => {
      const { errors } = await parse(CreateProjectDto, { ...base, descriptionEn: value, descriptionAr: '<p>x</p>' });
      expect(errors.map((e) => e.property)).toContain('descriptionEn');
    },
  );

  it('sanitizes descriptions on update too', async () => {
    const { dto, errors } = await parse(UpdateProjectDto, {
      descriptionAr: '<p onmouseover="alert(1)">x</p><svg onload=alert(1)></svg>',
    });
    expect(errors).toHaveLength(0);
    expect(dto.descriptionAr).toBe('<p>x</p>');
  });

  it('leaves non-string values to the validators', async () => {
    const { errors } = await parse(CreateProjectDto, { ...base, descriptionEn: 42, descriptionAr: '<p>x</p>' });
    expect(errors.map((e) => e.property)).toContain('descriptionEn');
  });
});
